from dotenv import load_dotenv
import os

# this files load environment vars so that we don't have to load env vars every time. Just import this file 
load_dotenv()

class Settings:
  APP_NAME = "Agno Research Assitant"
  OPENAI_API_KEY= os.getenv("OPENAI_API_KEY")

settings = Settings()