#  Core libraries for API and Data Processing
import re
import uuid
import json
import en_core_web_sm
import os
import time
import math
import nltk
import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import defaultdict
from datetime import datetime, timedelta
from dotenv import load_dotenv
from nltk.corpus import stopwords

# Core libraries for MongoDB
import atexit
from pymongo import MongoClient

# Core libraries for the chatbot LLM Model
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationChain
from py3langid.langid import LanguageIdentifier, MODEL_FILE

# ---------- Start of Initialising Environment Variables ----------
load_dotenv() # Load the environment for retrieval of private / secret keys
nltk.download('stopwords') # NLTK's stopword corpus

# MongoDB connection
client = MongoClient(os.getenv("CONNECTION_STRING"))
db = client["chatbot-database"]
history_collection = db["history"]
keywords_collection = db["keywords"]
conversationResolution_collection = db["conversation-resolution"]
ratings_collection = db["ratings"]
admin_users_collection = db["admin-users"]

# Define stopwords for multiple languages
languages = ['english', 'spanish', 'russian', 'french', 'german', 'chinese', 'arabic']
stop_words = set()

# Combine stopwords from multiple languages
for lang in languages:
	stop_words.update(stopwords.words(lang))

nlp = en_core_web_sm.load() # TO BE TRANSFERRED TO LLM TRAINING FOLDER
app = Flask(__name__) # Initialise the Flask app
CORS(app)  # Enable CORS (Cross-Origin Resource Sharing) for all routes in react app 
# ---------- End of Initialising Environment Variables ----------


# ---------- Start of Building the Chatbot Model ----------
model = OllamaLLM(model="stablelm2") # LLM Model to be used for chatbot

prompt = ChatPromptTemplate.from_messages([
	('system', 'You are a helpful UOB chatbot assistant. Response to customer queries in a detailed and accurate manner.'),
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

# Write to DB log the conversation
def log_conversation(userInputMessage, botResponse, execution_time, userInfo) -> None:
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

# Write to DB to log the keywords
def user_conversation(userInputMessage, userInfo) -> str:
	# Log the user input into our keywords file
	words = re.findall(r'\b\w+\b', userInputMessage)
	for word in words:
		word = word.lower()  # Optional: Convert to lowercase for case-insensitive matching
		if word not in stop_words:
			# Update MongoDB keyword collection
			existing_keyword = keywords_collection.find_one({"keyword": word})
			if existing_keyword:
				keywords_collection.update_one({"keyword": word}, {"$inc": {"count": 1}})
			else:
				keywords_collection.insert_one({"keyword": word, "count": 1})

	start_time = time.time()
	botResponse = chain.invoke({'input' : f"{userInputMessage}"})
	end_time = time.time()

	execution_time = end_time - start_time  # Calculate the execution time
	log_conversation(userInputMessage, botResponse, execution_time, userInfo)

	return botResponse.get("response")
# ---------- End of Chatbot Functions ----------
	

# ---------- Start of API Functions ----------
# Function that authenticates the admin user
@app.route('/userLoginAuth', methods = ['POST'])
def userLoginAuth():
	data = request.json
	username = data.get("username")
	email = data.get("email")
	password = data.get("password")
	adminCode = data.get("adminCode")
 
	if adminCode != "admin":
		raise ValueError("Incorrect Admin Code Provided")

	# Fetch and cross check with existing users in the database
	user = admin_users_collection.find_one({"email": email, "username": username})
	if user == None:
		raise ValueError("Invalid Credentials or User does not exist")
	
	else:
		if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
			print("Password Matched")
			return {"status": "Successful Login"}

# Function to fetch user profile
@app.route('/fetchUserProfile', methods = ['POST'])
def userProfile():
	data = request.json
	username = data.get("username")
	user = admin_users_collection.find_one({"username": username})
 
	if user == None:
		raise ValueError("User does not exist")
	else:
		return {"username": user["username"], "email": user["email"]}

# Function to sign up a new admin user
@app.route('/userSignUpAuth', methods = ['POST'])
def userSignUpAuth():
	data = request.json
	username = data.get("username")
	email = data.get("email")
	password = data.get("password")
	adminCode = data.get("adminCode")
 
	if adminCode != "admin":
		raise ValueError("Incorrect Admin Code Provided")
	else:
   	# Generate salt
		salt = bcrypt.gensalt()
		hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
		admin_users_collection.insert_one({
			"username": username,
			"email": email,
			"password": hashed_password,
		})
		return {"status": "Successful Signup"}
	

# Find similar questions (sentences) in the chat history


# Update Conversation Resolution Metrics in DB when admin resolves an unresolved or escalated conversation
@app.route("/update_conversation_status", methods = ['POST'])
def update_conversation_status():
  data = request.json
  
  status = data.get("status")
  user_name = data.get("user_name")
  contact_no = data.get("contact_no")
  user_input = data.get("user_input")
  bot_response = data.get("bot_response")
  user_feedback = data.get("user_feedback")
    
  if not all([status, user_name, contact_no, user_input, bot_response, user_feedback]):
    return {"status": "error", "message": "Missing required fields"}

  convoRes = list(conversationResolution_collection.find())
  
  for document in convoRes:
    if status in document:
      conversationResolution_collection.update_one(
        {"_id": document["_id"]},
				{
					"$pull": {
						status: {
						"user_name": user_name, 
						"contact_no": contact_no,
						"user_input": user_input,
						"bot_response": bot_response,
						"user_feedback": user_feedback
						}
					}
				}
			)
      break
    
  conversationResolution_collection.update_one(
    {"_id": document["_id"] for document in convoRes if "Resolved" in document},
		{
			"$push": {
				"Resolved": {
      		"user_name": user_name, 
        	"contact_no": contact_no,
					"user_input": user_input,
					"bot_response": bot_response,	
					"user_feedback": user_feedback
        }
			}
		}
	)
  
  return {"status": "success"}
	
# Conversation Logs in Table Form
@app.route('/conversation_history')
def conversation_history():
	conversation_log = []
	for entry in history_collection.find(): # Retrieve the data from our History Table in DB
		conversation_log.append({
			"username": entry["username"],
			"language_code": entry["language_code"],
			"timestamp": entry["timestamp"],
			"input": entry["input"],
			"output": entry["output"]
		})
	return conversation_log


# Compute percentage change of metrics
@app.route('/percentage__metric_computation')
def compute_percentage_change():
	# Retrieve the last two entries from the conversation resolution collection
	convoLog = list(history_collection.find())
	
	# Calculate the percentage change of interactions and users
	# Step 1: Get the user count for each datetime (by week) from the convoLog
	userInterCount = defaultdict(int)
	userCount = defaultdict()
	
	for entry in convoLog:
		# Only retrieve the date from the timestamp
		dateStr = entry["timestamp"].split(" ")[0]
  
		date_obj = datetime.strptime(dateStr, '%Y-%m-%d')
		start_of_week = date_obj - timedelta(days=date_obj.weekday())  
		userInterCount[start_of_week.strftime('%Y-%m-%d')] += 1

		if start_of_week.strftime('%Y-%m-%d') not in userCount:
			userCount[start_of_week.strftime('%Y-%m-%d')] = []
			userCount[start_of_week.strftime('%Y-%m-%d')].append(entry["username"])
		else:
			userCount[start_of_week.strftime('%Y-%m-%d')].append(entry["username"])
  
	# Sort the user count by date
	sortedUserCount = dict(sorted(userInterCount.items(), key=lambda item: item[0]))
	# Calculate the percentage change of interactions (since last week)
	w0, w1 = list(sortedUserCount.values())[-2], list(sortedUserCount.values())[-1]
	percentageIntChange = round(((w1 - w0) / w0) * 100, 3)
	

 	# Step 2: Calculate the percentage change of users by the weeks
  # Compress the entire list of users 
	for key, value in userCount.items():
		userCount[key] = len(set(value))

 	#	Sort the user count by date
	sortedUserCount = dict(sorted(userCount.items(), key=lambda item: item[0]))
	u0, u1 = list(sortedUserCount.values())[-2], list(sortedUserCount.values())[-1]
	percentage_change = round(((u1 - u0) / u0) * 100, 3)

	return {
		"percentage_change_interactions": percentageIntChange,
		"percentage_change_users": percentage_change,
	}


# Basic Numerical Information on Chat Logs
@app.route('/basic_chat_information')
def compute_chat_statistics():
	totalLogs = history_collection.count_documents({}) # Total Chat Logs
	uniqueUsers = len(set([log["username"] for log in history_collection.find()]))
	languagesDetected = len(set([log["language_code"] for log in history_collection.find()]))

	responseCount = 0
	totalResponseTime = 0

	for entry in history_collection.find():
		if "response_time_seconds" in entry:
			responseCount += 1
			totalResponseTime += entry["response_time_seconds"]

	return {
		"total_conversations": totalLogs,
		"unique_users": uniqueUsers,
		"languages_detected": languagesDetected,
		"average_response_time": round(totalResponseTime / responseCount, 6)
	}

# Language Distribution of Chat Logs
@app.route('/languages_distribution')
def compute_language_distribution():
	languagesDetected = defaultdict(int)

	for entry in history_collection.find():
		languagesDetected[entry.get("language_code")] += 1

	# Return the top 8 languages
	sortedDict = dict(sorted(languagesDetected.items(), key=lambda item: item[1], reverse=True)[:8])

	return dict(sortedDict)

# Conversation Resolution Metrics (Unresolved, Resolved, Escalated)
@app.route('/conversation_resolution_metrics')
def resolution_metrics():	
	data = []

	for document in conversationResolution_collection.find():
		if 'Unresolved' in document:
			data.append({"Unresolved": document['Unresolved']})
		if 'Resolved' in document:
			data.append({"Resolved": document['Resolved']})
		if 'Escalated' in document:
			data.append({"Escalated": document['Escalated']})
	
	return data

# Word Cloud for Most Searched Terms
@app.route('/most_searched_terms')
def most_searched_terms():
  keywordCollection = list(keywords_collection.find())
  keywordDict = defaultdict(int)
  
  for keyword in keywordCollection:
    if keyword["keyword"] not in keywordDict:
      keywordDict[keyword["keyword"]] = keyword["count"]
  
	# Only select the top 25 terms
  top_25 = dict(sorted(keywordDict.items(), key=lambda item: item[1], reverse=True)[:25])
  return top_25

# User Frequency Across Time
@app.route('/user_frequency_across_time')
def user_frequency():
	frequency = defaultdict(int)

	for entry in history_collection.find():
		date_str = entry["timestamp"].split(" ")[0] # Extract the date from the timestamp
		frequency[date_str] += 1 # Count the user occurrence on that date

	date_freq = dict(frequency)
	dates = sorted([datetime.strptime(date, '%Y-%m-%d').date() for date in date_freq.keys()])
	# Find the range of dates (from min date to today)
	min_date = dates[0]
	max_date = datetime.now().date()  # Set max date to today's date

	# Initialize a new dictionary with all dates from min date to today's date
	complete_date_freq = {}
	current_date = min_date

	while current_date <= max_date:
		date_str = current_date.strftime('%Y-%m-%d')
		# Use frequency from the original dictionary or 0 if the date is missing
		complete_date_freq[date_str] = date_freq.get(date_str, 0)
		current_date += timedelta(days=1)
  
	return dict(complete_date_freq)

# Chat Duration Log Per User
@app.route('/chat_duration_per_user')
def chat_duration_per_user():
	duration = defaultdict(list)
	
	for entry in history_collection.find():
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
	# To do so, we will assume that a chat session is over if the duration between 
  # two chat sessions is greater than 1 hr (3600s)
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

	responseData = res[0]
	ratings_collection.insert_one({
		"ratings": int(responseData.get("ratings")),
		"feedback": responseData.get("feedback"),
		"username": responseData.get("username"),
		"userPhone": int(responseData.get("userPhone"))
	})
	
	return {"status": "success"}

# Log user feedbacks and resolutions to DB
@app.route('/feedbacks', methods = ['POST'])
def user_feedbacks_resolution():
  res = request.json
  responseData = res[0]    
  convoRes = list(conversationResolution_collection.find())

	# Unique ID will by default be generated in the database
  if responseData.get("actionType") == "Report":
    conversationResolution_collection.update_one(
			{"_id": document["_id"] for document in convoRes if "Unresolved" in document},
			{
				"$push": {
					"Unresolved": {
       			"user_name": responseData.get("username"),
          	"contact_no": int(responseData.get("userPhone")),
						"user_input": responseData.get("userInput"),
						"bot_response": responseData.get("botResponse"),
						"user_feedback": responseData.get("feedback"),
           }
				}
			}
		)
  elif responseData.get("actionType") == "Escalate":
    conversationResolution_collection.update_one(
			{"_id": document["_id"] for document in convoRes if "Escalated" in document},
			{
				"$push": {
					"Escalated": {
       			"user_name": responseData.get("username"), 
          	"contact_no": int(responseData.get("userPhone")),
						"user_input": responseData.get("userInput"),
      			"bot_response": responseData.get("botResponse"),
						"user_feedback": responseData.get("feedback")
          }
				}
			}
		)
   
  return {"status": "success"}


# Compute the user ratings for speedometer display
@app.route('/user_ratings')
def customer_ratings():
	ratings = 0
	
	for entry in ratings_collection.find():
		ratings += entry["ratings"]
	
	return jsonify({'ratings': ratings / ratings_collection.count_documents({})})
# ---------- End of API Functions ----------

# Ensure MongoDB connection closes when the app exits
def close_mongo_connection():
  client.close()

atexit.register(close_mongo_connection)

#  If the script is run directly, start the Flask app
if __name__ == '__main__':
	app.run(debug = True)
 	