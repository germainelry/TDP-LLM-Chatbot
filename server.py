from flask import Flask
from collections import defaultdict
from datetime import datetime
import json
import math
import spacy
import en_core_web_sm
from deep_translator import GoogleTranslator
import re

nlp = en_core_web_sm.load()
app = Flask(__name__)

# Conversation Logs in Table Form
@app.route('/conversation_history')
def conversation_history():
	try:
		with open("history.json", "r") as file:
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
			with open("history.json", "r") as file:
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
		with open("history.json", "r") as file:
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
		with open("conversationResolution.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}

	return data

# Word Cloud for Most Searched Terms
@app.route('/most_searched_terms')
def most_searched_terms():
	try:
		with open("keywords.json", "r") as file:
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
		with open("history.json", "r") as file:
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
		with open("history.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}

	duration = defaultdict(list)
	
	for entry in data:
		username = entry["username"]
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
	print(chat_duration_interval)

	criteria = 3600

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

	# React histogram to show the distribution of chat duration
	return dict(split_data)


# Most asked questions





if __name__ == '__main__':
	app.run(debug = True)
		