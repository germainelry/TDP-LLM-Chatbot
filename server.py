from flask import Flask
from collections import defaultdict
from datetime import datetime
import json


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

	return {
		"total_conversations": totalLogs,
		"unique_users": uniqueUsers,
		"languages_detected": languagesDetected
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


# Word Cloud for Most Searched Terms


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


# Most searched questions





if __name__ == '__main__':
    app.run(debug = True)