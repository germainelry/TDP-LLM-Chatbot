import logging
import os

from telegram import Update, InlineQueryResultArticle, InputTextMessageContent
from telegram.ext import filters, \
  ApplicationBuilder, ContextTypes, \
    CommandHandler, MessageHandler, InlineQueryHandler
from dotenv import load_dotenv
from uuid import uuid4

load_dotenv()

# Load the llama3 model into the telegram bot
from chatbot import user_conversation

# This section sets up the logging module to print out log messages
logging.basicConfig(
  format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
  level = logging.INFO
)

# Level 1 functionality: Respond with /start which is the first command that is sent to the bot
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
  await context.bot.send_message(
    chat_id = update.effective_chat.id, 
    text = "Hello! I am BOU, the UOB bot, and I am happy to assist any queries you have!"
  )

  # Return a welcome message to the user too when they start the bot with /start
  f = open("introductory_message.txt", "r")
  await context.bot.send_message(
    chat_id = update.effective_chat.id, 
    text = f.read()
  )

# Level 1 functionality: Respond with the user's message in uppercase
async def caps(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None: 
    text_caps = ' '.join(context.args).upper()
    await context.bot.send_message(
      chat_id = update.effective_chat.id, 
      text = text_caps
  )

# Level 1 functionality
async def inline_caps(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
  query = update.inline_query.query
  if not query:
    return
  results = []
  results.append(
    InlineQueryResultArticle(
      id = str(uuid4()),
      title = 'Caps',
      input_message_content = InputTextMessageContent(query.upper())
    )
  )
  await context.bot.answer_inline_query(update.inline_query.id, results)

# Level 1 functionality: Respond with a message that the command is unknown
async def unknown(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
  await context.bot.send_message(
    chat_id = update.effective_chat.id, 
    text = "Sorry, I didn't understand that command."
  )

# Level 1 functionality: Respond with a list of commands that the bot understands
async def help(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
  await context.bot.send_message(
    chat_id = update.effective_chat.id, 
    text = "I am a bot that can help you with your queries. Here are the commands I understand:\n\n"
    "/start - Start the bot\n"
    "/caps - Convert text to uppercase\n"
    "/inline - Inline mode\n\n"
    "... or simply enter your queries into the chat box!"
  )

# Level 2 functionality: Respond to the user's message
async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
  await context.bot.send_message(
    chat_id = update.effective_chat.id, 
    text = user_conversation(update)
 )


if __name__ == '__main__':
  # Instantiating the application with the API token
  # tdp_demo_bot is the name of the bot created in the previous step
  application = ApplicationBuilder().token(os.getenv("API_TOKEN")).build()
  
  start_handler = CommandHandler('start', start) # Tells your bot to listen for the /start command
  caps_handler = CommandHandler('caps', caps) # Tells your bot to listen for the /caps command
  help_handler = CommandHandler('help', help) # Tells your bot to listen for the /help command
  echo_handler = MessageHandler(filters.TEXT & (~filters.COMMAND), echo) # Tells your bot to listen for any text message that is not a command and echo it back
  inline_caps_handler = InlineQueryHandler(inline_caps)
  unknown_handler = MessageHandler(filters.COMMAND, unknown)
    
  application.add_handler(start_handler)
  application.add_handler(caps_handler) # Adds the caps_handler to the application. E.g. /caps hello -> HELLO
  application.add_handler(help_handler)
  application.add_handler(echo_handler)
  application.add_handler(inline_caps_handler)
  application.add_handler(unknown_handler)
  
  # Bot continuously polls for new messages until the user stops the bot
  application.run_polling()