import asyncio
import telegram
import os
from dotenv import load_dotenv

load_dotenv()

async def main() -> None:
    bot = telegram.Bot(os.getenv("API_TOKEN"))
    async with bot:    
        updates = (await bot.get_updates())[0].to_dict()
        print(updates.get("message").get("chat").get("id"))
        print(updates.get("message").get("chat").get("username"))
        print(updates.get("message").get("message_id"))
        print(updates.get("message").get("text"))
        print(updates.get("message").get("date"))
        print(updates.get("message").get("from").get("language_code"))
        firstName = updates['message']['chat']['first_name']
        lastName = updates['message']['chat']['last_name']
        fullName = firstName + " " + lastName
        chatId = updates['message']['chat']['id']
        await bot.send_message(text=f'Hi {fullName}!', chat_id=chatId)
        
if __name__ == '__main__':
    asyncio.run(main())