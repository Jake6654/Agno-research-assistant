from pydantic import BaseModel

class ResearchRequest(BaseModel):
  question: str 
  user_id: str | None = None
  session_id: str | None = None

class ResearchResponse(BaseModel):
  response: str