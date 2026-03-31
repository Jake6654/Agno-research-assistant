import json
from app.agents.planner_agent import planner_agent
from app.agents.search_agent import run_search_agent
from app.agents.writer_agent import writer_agent
from app.schemas.pipeline import SearchOutput

def run_research_pipeline(question: str, session_id: str | None=None) -> str:
  planner_result = planner_agent.run(question, session_id=session_id)
  planner_data = json.loads(planner_result.content)

  route = planner_data.get("route", "search_then_write")

  if route == "write_only":
    writer_result = writer_agent.run(question, session_id=session_id)
    return writer_result.content
  
  search_result = run_search_agent(question)
  # ensures the output matched the expected schema
  search_data = SearchOutput.model_validate(search_result)

  writer_input = f"""

  User question:
  {question}

  Web Search findings:
  {json.dumps(search_data.model_dump(), indent=2, ensure_ascii=False)}
  """

  writer_result = writer_agent.run(writer_input, session_id=session_id)
  return writer_result.content  
