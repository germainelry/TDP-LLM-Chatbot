from flask import Flask
import json

app = Flask(__name__)

@app.route('/channels')
def channels():
    return {"channels": ["#general", "#random", "#bots"]}

@app.route('/conversation_history')
def conversation_history():
	try:
		with open("history.json", "r") as file:
			data = json.load(file)
	except json.decoder.JSONDecodeError:
		data = {}
	return data

if __name__ == '__main__':
    app.run(debug = True)