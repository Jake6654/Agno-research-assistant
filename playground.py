from app.agents.research_agent import research_Agent
from app.core.config import OPENAI_API_KEY
from agno.utils.pprint import pprint_run_response

response = research_Agent.run(input="What is retrieval augmented generation?", )

# print the response in markdown format
pprint_run_response(response, markdown=True)