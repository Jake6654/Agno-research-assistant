from pydantic import BaseModel, Field
from typing import List, Literal


# They ensure that the data returned by the model follow a specific format.
class Finding(BaseModel):
  title: str
  url: str
  summary: str
  # Literal restricts the value to a fixed set of options 
  confidence: Literal ["high", "medium", "low"] = "medium"

class SearchOutput(BaseModel):
  normalized_question: str
  # default_factory=list prevents shared mutable state by creating a new list for each instance
  subquestions: List[str] = Field(default_factory=list)
  findings: List[Finding] = Field(default_factory=list)
  missing_information: List[str] = Field(default_factory=list)
