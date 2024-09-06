import os
from dotenv import load_dotenv
from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.chains import ConversationChain
from langchain.memory import \
    ConversationBufferMemory, \
        ConversationBufferWindowMemory, \
            ConversationTokenBufferMemory, \
                VectorStoreRetrieverMemory, \
                    ConversationSummaryMemory
from langchain.vectorstores import Chroma
from langchain_community.embeddings.openai import OpenAIEmbeddings



load_dotenv()

# Cretae a model
model = OllamaLLM(model="llama3")

# Create a chat prompt template
prompt = ChatPromptTemplate.from_messages([
    ('system', 'You are a helpful assistant. Answer the question asked by the user in maximum 30 words.'),
    ('user', 'Question : {input}'),
])

#### Basic Chain (no memory)
# Create a chain with this memory object and the model object created earlier.
memory = ConversationBufferMemory()
chain = ConversationChain(
    llm = model,
    memory = memory
)


#### BufferWindow (memory)
# Create a memory object which will store the conversation history.
# Let us creare a ConversationBufferWindowMemory with k=1, which remembers only the previous 1 message
window_memory = ConversationBufferWindowMemory(k = 5)
window_memory_chain = ConversationChain(
    llm = model,
    memory = window_memory
)


#### TokenBuffer (memory)
token_buffer_memory = ConversationTokenBufferMemory(
  llm = model, 
  max_token_limit = 100
) # default max_token_limit is 2000
token_buffer_chain = ConversationChain(
    llm = model,
    memory = token_buffer_memory
)


#### Summary (memory)
summary_memory = ConversationSummaryMemory(llm = model)
sumamry_memory_chain = ConversationChain(
    llm = model,
    memory = summary_memory,
    verbose = True
)


#### Vector Store (memory)
# vectorstore = Chroma(
#   collection_name = 'history', 
#   embedding_function = OpenAIEmbeddings(openai_api_key = os.getenv("OPEN_AI_API_KEY"))
# )

# retriever = vectorstore.as_retriever() # Create your retriever 
# vectorstore_retriever_memory = VectorStoreRetrieverMemory(retriever = retriever) # Create your VectorStoreRetrieverMemory

# vectorstore_retriever_memory.save_context({'input':'My name is John'}, {'output':'Hello John! How can I help you?'})
# vectorstore_retriever_memory.save_context({'input':'I am looking for some vegeatarian restaurents nearby.'}, {'output':'There is a veg restaurent named `Veg Treat` at walking distance from here.'})
# vectorstore_retriever_memory.save_context({'input':'Oh, great! Thanks for the recommendation. Is Veg Treat known for any particular dish? I\'m always on the lookout for delicious vegetarian options.'}, {'output':'Absolutely, John! Veg Treat is well-known for its signature dish, the "Mushroom Medley Delight." It\'s a savory combination of assorted mushrooms cooked with aromatic herbs and spices. Many patrons love it for its unique flavor. If you enjoy mushrooms, I\'d highly recommend trying it out!'})
# vectorstore_retriever_memory.save_context({'input':'That sounds amazing! I\'m a big fan of mushrooms, so I\'ll definitely give the Mushroom Medley Delight a try. Is there anything else you\'d recommend at Veg Treat, perhaps a special dessert or a refreshing drink?'}, {'output':'Certainly, John! Their "Green Bliss Smoothie" is a popular choice among customers. It\'s a refreshing blend of spinach, kiwi, and mint, creating a delightful and healthy beverage. And for dessert, the "Chocolate Avocado Mousse" is a must-try - a rich, creamy treat that surprises many with its unique combination of flavors.'})

# vectorstore_retriever_memory.save_context({'input': 'What is the weather like today?'}, {'output': 'The weather forecast predicts a sunny day with a high of 75 degrees Fahrenheit.'})
# vectorstore_retriever_memory.save_context({'input': 'Do you have any jokes to tell?'}, {'output': 'Why did the scarecrow win an award? Because he was outstanding in his field! '})
# vectorstore_retriever_memory.save_context({'input': 'Can you translate "hello" to Spanish?'}, {'output': 'Hola!  "Hola" means "hello" in Spanish.'})
# vectorstore_retriever_memory.save_context({'input': 'What are some interesting historical facts?'}, {'output': 'Did you know the population of the Earth is estimated to be over 8 billion people!  Fascinating, right?'})

# vectordb_memory_chain = ConversationChain(
#     llm = model,
#     memory = vectorstore_retriever_memory,
#     verbose = True
# )


if __name__ == "__main__":
    # Test the basic chain
    # response1 = chain.invoke({'input' : 'What is the weather like today?'})
    # print(response1)

    # # Test the buffer window memory chain
    # response2 = window_memory_chain.invoke({'input' : 'Which is the most popular Beethoven\'s symphony?'})
    # print(response2)
    # response3 = window_memory_chain.invoke({'input' : 'Which is the last one?'})
    # print(response3)

    # # Test the token buffer memory chain
    # response4 = token_buffer_chain.invoke({'input' : 'Hello there. I am Vinayak, I am 34 years old and I like swimming.'})
    # print(response4)
    # response5 = token_buffer_chain.invoke({'input' : 'How can I explain butterfly swimming style to a 5 year old child?'})
    # print(response5)

    # Test the summary memory chain
    response6 = sumamry_memory_chain.invoke({'input' : 'How can I explain butterfly swimming style to a 5 year old child?'})
    print(response6)
    response7 = sumamry_memory_chain.invoke({'input' : 'How old I am?'})
    print(response7)


    # Test the vector store retriever memory chain
    # response8 = vectordb_memory_chain.invoke({'input' : 'what was the veg restaurant name suggested?'})
    # print(response8)


