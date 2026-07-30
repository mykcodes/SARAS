import os
from dotenv import load_dotenv, find_dotenv

# find_dotenv() automatically searches up the folder tree to find your .env file
load_dotenv(find_dotenv())

class Settings:
    MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY", "")

settings = Settings()