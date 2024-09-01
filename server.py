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

	metrics = defaultdict(int)

	for entry in data:
		if "Unresolved" in entry:
			metrics['Unresolved'] += len(entry["Unresolved"])
		if "Resolved" in entry:
			metrics['Resolved'] += len(entry["Resolved"])
		if "Escalated" in entry:
			metrics['Escalated'] += len(entry["Escalated"])

	return dict(metrics)


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

# Most searched questions





if __name__ == '__main__':
    app.run(debug = True)