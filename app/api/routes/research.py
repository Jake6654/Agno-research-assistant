from fastapi import APIRouter, HTTPException
from app.schemas.research import ResearchRequest, ResearchResponse
from app.agents.research_agent import research_Agent

router = APIRouter()

@router.post("/research", response_model=ResearchResponse)
def run_research(request: ResearchRequest):
  try:
    response = research_Agent.run(request.question)
    # response is a object. The agent returns response 
    # needs to get the content by response.content
    return ResearchResponse(response=response.content)
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
  
