import os
from dotenv import load_dotenv
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.memory import ConversationBufferMemory, ConversationBufferWindowMemory, ConversationSummaryMemory, VectorStoreRetrieverMemory
from langchain.chains import ConversationChain
from langchain.vectorstores import Chroma
from langchain_community.embeddings.openai import OpenAIEmbeddings

load_dotenv()

# Template for the chatbot
model = OllamaLLM(model="llama3")
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

# ### Other approaches to memorise ###
# # Be sure to change the name of the chain

# # Summary object
# summary_memory = ConversationSummaryMemory(llm = model)
# summary_memory_chain = ConversationChain(
#     llm = model,
#     memory = summary_memory,
#     verbose = True
# )

# # Vector store retriever
# vector_store = Chroma(
#   collection_name = 'history', 
#   embedding_function = OpenAIEmbeddings()
# )
# # Convert the vector store to a retriever i.e VectorStoreRetrieverMemory
# retriever = vector_store.as_retriever()
# # Create a retriever memory object
# vectorstore_retriever_memory = VectorStoreRetrieverMemory(
#   retriever = retriever)

# vectordb_memory_chain = ConversationChain(
#     llm = model,
#     memory = vectorstore_retriever_memory,
#     verbose = True
# )


# static run of the chatbot with buffer window memory
def test_run_buffer_window_memory() -> None:
  context = ""
  print("Welcome to the chatbot! Type 'exit' to end the conversation.")
  while True:
    user_input = input("You: ")
    if user_input == "exit":
      break
    result = chain.invoke({'input' : user_input})
    print("Bot:", result.get("response"))
    context += f"User: {user_input}\nBot: {result}\n"


if __name__ == '__main__':
  test_run_buffer_window_memory()




