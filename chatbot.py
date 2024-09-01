import json
import os
import time
import math

from dotenv import load_dotenv
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.memory import ConversationBufferMemory, ConversationBufferWindowMemory, ConversationSummaryMemory, VectorStoreRetrieverMemory
from langchain.chains import ConversationChain
from langchain.vectorstores import Chroma
from langchain_community.embeddings.openai import OpenAIEmbeddings
from language_detection import detect_language_with_langid


load_dotenv()

# Template for the chatbot
# model = OllamaLLM(model="llama3")
model = OllamaLLM(model="stablelm2")

prompt = ChatPromptTemplate.from_messages([
    ('system', 'You are a helpful assistant. Answer the question asked by the user in maximum 30 words.'),
    ('user', 'Question : {input}'),
])
chain = prompt | model | StrOutputParser()

# Used for storing the conversation history
window_memory = ConversationBufferWindowMemory(k = 20) # Remember the last k conversations
chain = ConversationChain(
  llm = model, 
  memory = window_memory
)

# Template for the chatbot
# template = """
# Answer the question below.

# Here is the conversation history: {context}

# Question: {question}

# Answer: 
# """

# model = OllamaLLM(model="llama3")
# result = model.invoke(input="Hello, how are you? What is the weather like?")
# prompt = ChatPromptTemplate.from_template(template)
# chain = prompt | model




# Write to json file to log the conversation
def log_conversation(update, result, execution_time) -> None:
  try:
    with open("history.json", "r") as file:
      data = json.load(file)
  except json.decoder.JSONDecodeError:
    data = []
  data.append(
    {
      "chat_id": update.message.chat.id,
      "timestamp": (update.message.date).strftime('%Y-%m-%d %H:%M:%S'),
      "username": update.message.chat.username,
      "language_code": detect_language_with_langid(update.message.text),
      "response_time_seconds": round(execution_time, 6),
      "input": update.message.text,
      "output": result.get("response")
    }
  )
  with open("history.json", 'w') as file:
      json.dump(data, file, indent = 2)

def handle_conversation() -> None:
  context = ""
  print("Welcome to the chatbot! Type 'exit' to end the conversation.")
  while True:
    user_input = input("You: ")
    if user_input == "exit":
      break
    result = chain.invoke({"context": context, "question": user_input})
    print("Bot:", result)
    context += f"User: {user_input}\nBot: {result}\n"

def user_conversation(update) -> str:
  detected_lang = detect_language_with_langid(update.message.text)
  start_time = time.time()
  result = chain.invoke({'input' : f"{update.message.text}"})
  end_time = time.time()

  # Calculate the execution time
  execution_time = end_time - start_time  
  log_conversation(update, result, execution_time)
  return result.get("response")

if __name__ == '__main__':
  handle_conversation()