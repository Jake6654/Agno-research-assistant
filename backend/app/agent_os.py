from agno.os import AgentOS
from app.agents.research_agent import research_Agent

def build_agent_os(base_app):
  agent_os = AgentOS(
    id="my-research-os",
    agents=[research_Agent],
    base_app=base_app,
  )
  return agent_os