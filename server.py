#  Core libraries for API and Data Processing
import re
import json
import en_core_web_sm
import os
import time
import math
import nltk
from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import defaultdict
from datetime import datetime
from dotenv import load_dotenv
from nltk.corpus import stopwords

# Core libraries for MongoDB
import atexit
from pymongo import MongoClient

# Core libraries for the chatbot LLM Model
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.memory import ConversationBufferMemory, \
	ConversationBufferWindowMemory, ConversationSummaryMemory, \
		VectorStoreRetrieverMemory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.chains import ConversationChain
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings.openai import OpenAIEmbeddings
from py3langid.langid import LanguageIdentifier, MODEL_FILE


# ---------- Start of Initialising Environment Variables ----------
load_dotenv()
nltk.download('stopwords')

# MongoDB connection
client = MongoClient("mongodb+srv://germainelry:makeachatbot@uob-chatbot-database.6q6z5.mongodb.net/")
db = client["chatbot-database"]
history_collection = db["history"]
keywords_collection = db["keywords"]
conversationResolution_collection = db["conversation-resolution"]

# Define stopwords in all possible languages
# Define stopwords for multiple languages
languages = ['english', 'spanish', 'russian', 'french', 'german', 'chinese', 'arabic']
stop_words = set()

# Combine stopwords from multiple languages
for lang in languages:
    stop_words.update(stopwords.words(lang))

nlp = en_core_web_sm.load()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# ---------- End of Initialising Environment Variables ----------


# ---------- Start of Building the Chatbot Model ----------
# LLM Model to be used for chatbot
model = OllamaLLM(model="stablelm2")

prompt = ChatPromptTemplate.from_messages([
    ('system', 'You are a helpful assistant. Answer the question asked by the user in maximum 30 words.'),
    ('user', 'Question : {input}'),
])
chain = prompt | model | StrOutputParser() # Pipeline for initialising the chatbot

# Used for storing the conversation history
window_memory = ConversationBufferWindowMemory(k = 20) # Remember the last k conversations

# Define a function to get the session history (this would pull from the memory)
def get_session_history():
    return window_memory.load_memory_variables({})["history"]

chain = ConversationChain(
  llm = model,
	memory = window_memory
)
# ---------- End of Building the Chatbot Model ----------


# ---------- Start of Chatbot Functions ----------
# Detect the language of the input text
def detect_language_with_langid(line) -> str:     
	identifier = LanguageIdentifier.from_pickled_model(MODEL_FILE, norm_probs=True) 
	lang, prob = identifier.classify(line)
	return lang

# Write to json file to log the conversation
def log_conversation(userInputMessage, botResponse, execution_time, userInfo) -> None:
	try:
		with open("data/history.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = []

	data.append(
		{
			"chat_id": int(userInfo.get("phone")),
			"timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
			"username": userInfo.get("name"),
			"language_code": detect_language_with_langid(userInputMessage),
			"response_time_seconds": round(execution_time, 6),
			"input": userInputMessage,
			"output": botResponse.get("response")
		}
	)
	with open("data/history.json", 'w') as file:
			json.dump(data, file, indent = 2)

	# Insert into MongoDB
	history_collection.insert_one({
			"chat_id": int(userInfo.get("phone")),
			"timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
			"username": userInfo.get("name"),
			"language_code": detect_language_with_langid(userInputMessage),
			"response_time_seconds": round(execution_time, 6),
			"input": userInputMessage,
			"output": botResponse.get("response")
	})
	# End of Insertion

def user_conversation(userInputMessage, userInfo) -> str:
	with open("data/keywords.json", 'r') as file:
		data = json.load(file)

	# Log the user input into our keywords file
	words = re.findall(r'\b\w+\b', userInputMessage)
	for word in words:
		word = word.lower()  # Optional: Convert to lowercase for case-insensitive matching
		if word not in stop_words:
			if word in data:
				data[word] += 1
			else:
				data[word] = 1

			# Update MongoDB keyword collection
			existing_keyword = keywords_collection.find_one({"keyword": word})
			if existing_keyword:
					keywords_collection.update_one({"keyword": word}, {"$inc": {"count": 1}})
			else:
					keywords_collection.insert_one({"keyword": word, "count": 1})

	with open("data/keywords.json", 'w') as file:
		json.dump(data, file, indent = 2)

	# Create a list of messages with proper role and content
	# messages = [
	# 		{"role": "system", "content": "You are a helpful assistant."},
	# 		{"role": "user", "content": userInputMessage}
	# ]

	start_time = time.time()
	botResponse = chain.invoke({'input' : f"{userInputMessage}"})
	
	# Germaine's code
	# botResponse = chain_with_history.invoke({"messages": messages})
	
	end_time = time.time()

	# Calculate the execution time
	execution_time = end_time - start_time  
	log_conversation(userInputMessage, botResponse, execution_time, userInfo)

	return botResponse.get("response")
# ---------- End of Chatbot Functions ----------


# ---------- Start of API Functions ----------
# Conversation Logs in Table Form
@app.route('/conversation_history')
def conversation_history():
	try:
		with open("data/history.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}

	conversation_log = []
	for entry in data:
		conversation_log.append({
			"username": entry["username"],
			"language_code": entry["language_code"],
			"timestamp": entry["timestamp"],
			"input": entry["input"],
			"output": entry["output"]
		})
	return conversation_log

# Basic Numerical Information
@app.route('/basic_chat_information')
def compute_chat_statistics():
	try:
			with open("data/history.json", "r") as file:
					data = json.load(file)
	except json.decoder.JSONDecodeError:
			data = {}

	# Total Chat Logs
	totalLogs = len(data)
	uniqueUsers = len(set([log["username"] for log in data]))
	languagesDetected = len(set([log["language_code"] for log in data]))

	responseCount = 0
	totalResponseTime = 0

	for entry in data:
		if "response_time_seconds" in entry:
			responseCount += 1
			totalResponseTime += entry["response_time_seconds"]

	return {
		"total_conversations": totalLogs,
		"unique_users": uniqueUsers,
		"languages_detected": languagesDetected,
		"average_response_time": round(totalResponseTime / responseCount, 6)
	}

# Language Distribution
@app.route('/languages_distribution')
def compute_language_distribution():
	try:
		with open("data/history.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}

	languagesDetected = defaultdict(int)

	for entry in data:
		languagesDetected[entry.get("language_code")] += 1

	return dict(languagesDetected)

# Conversation Resolution Metrics
@app.route('/conversation_resolution_metrics')
def resolution_metrics():
	try:
		with open("data/conversationResolution.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}

	return data

# Word Cloud for Most Searched Terms
@app.route('/most_searched_terms')
def most_searched_terms():
	try:
		with open("data/keywords.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}

	# Only select the top 20 terms
	top_20 = dict(sorted(data.items(), key=lambda item: item[1], reverse=True)[:20])
	return top_20

# User Frequency Across Time
@app.route('/user_frequency_across_time')
def user_frequency():
	try:
		with open("data/history.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}

	frequency = defaultdict(int)
	
	for entry in data:
		# Extract the date from the timestamp
		date_str = entry["timestamp"].split(" ")[0]
		# Count the user occurrence on that date
		frequency[date_str] += 1

	return dict(frequency)

# Chat Duration Log Per User
@app.route('/chat_duration_per_user')
def chat_duration_per_user():
	try:
		with open("data/history.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}

	duration = defaultdict(list)
	
	for entry in data:
		username = entry["username"]
		if username == None:
			username = "Unknown"
		timestamp = datetime.strptime(entry["timestamp"], "%Y-%m-%d %H:%M:%S")
		duration[username].append(timestamp)

	# Compute the time interval between each chat session
	chat_duration_interval = defaultdict(list)

	for user, times in duration.items():
		# Sort the timestamps to ensure they are in order
		times.sort()
		# Calculate the duration (seconds) between consecutive timestamps
		for i in range(1, len(times)):
			duration = (times[i] - times[i - 1]).total_seconds()
			chat_duration_interval[user].append(duration)
	
	# We will now segment out the chat duration to identify chat sessions
	# To do so, we will assume that a chat session is over if the duration between two chat sessions is greater than 1 hr (3600s)
	# We will then sum up the chat duration for each chat session
	criteria = 3600

	# Inner function for splitting our time intervals
	def split_values(values, criteria):
		result = []
		current_sublist = []

		for value in values:
			if value > criteria:
				if current_sublist:  # If there's already a sublist, save it
					result.append(current_sublist)
					current_sublist = []  # Reset for a new sublist
			else:
				current_sublist.append(int(value))  # Add to the current sublist
						
		if current_sublist:  # Add any remaining sublist
			result.append(current_sublist)
				
		return result
	split_data = {key: split_values(values, criteria) for key, values in chat_duration_interval.items()}
	
	# Now that we have the intervals for each session, we will sum up the chat duration for each session
	for user, intervals in split_data.items():
		for i, interval in enumerate(intervals):
			split_data[user][i] = sum(interval)
	
	# Convert results to minutes
	for user, intervals in split_data.items():
		for i, interval in enumerate(intervals):
			split_data[user][i] = round(interval / 60, 3)

	return dict(split_data)

# Pass user input to the chatbot from frontend
@app.route('/chatbot', methods = ['POST'])
def interface_to_chatbot():
	data = request.json
	message = data[0].get("message")
	userInfo = data[0].get("userInfo")
	result = user_conversation(message, userInfo) # Feed the user input into the chatbot
	return jsonify({'result': result})


# Retrieve user ratings from frontend
@app.route('/ratings', methods = ['POST'])
def user_chat_ratings():
	res = request.json
	try:
		with open("data/ratings.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = []

	data.append(res[0])
	
	with open("data/ratings.json", 'w') as file:
		json.dump(data, file, indent = 2)
	
	return {"status": "success"}

# Compute the user ratings for speedometer display
@app.route('/user_ratings')
def customer_ratings():
	try:
		with open("data/ratings.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}

	ratings = 0
	
	for entry in data:
		ratings += entry["ratings"]
	
	return jsonify({'ratings': ratings / len(data)})

# ---------- End of API Functions ----------

# Ensure MongoDB connection closes when the app exits
def close_mongo_connection():
    client.close()

atexit.register(close_mongo_connection)

#  If the script is run directly, start the Flask app
if __name__ == '__main__':
	app.run(debug = True)
