from dotenv import load_dotenv
import os

# this files load environment vars so that we don't have to load env vars every time. Just import this file 
load_dotenv()


def _parse_csv(value: str | None) -> list[str]:
  if not value:
    return []
  return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
  APP_NAME = "Agno Research Assitant"
  OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
  CORS_ALLOWED_ORIGINS = _parse_csv(os.getenv("CORS_ALLOWED_ORIGINS"))

settings = Settings()
