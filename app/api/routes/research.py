from fastapi import APIRouter, HTTPException
from app.schemas.research import ResearchRequest, ResearchResponse
from app.services.research_pipeline import run_research_pipeline

router = APIRouter()

@router.post("/research", response_model=ResearchResponse)
def research(request: ResearchRequest):
  try:
    answer = run_research_pipeline(
      question=request.question,
      session_id=request.session_id
    )
    return ResearchResponse(response=answer)
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
  
