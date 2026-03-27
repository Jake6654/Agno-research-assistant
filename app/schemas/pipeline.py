from pydantic import BaseModel, Field
from typing import List, Literal

class Finding(BaseModel):
  title: str
  url: str
  summary: str
  confidence: Literal ["high", "medium", "low"] = "medium"

class SearchOutput(BaseModel):
  normalized_question: str
  subquestions: List[str] = Field(default_factory=list)
  findings: List[Finding] = Field(default_factory=list)
  missing_information: List[str] = Field(default_factory=list)
