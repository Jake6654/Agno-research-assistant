from fastapi import FastAPI
from app.api.routes.health import router as health_router
from app.api.routes.research import router as research_router
from app.agent_os import build_agent_os
# This pattern matches the Agno docs: create FastAPI app, add routes, pass it as base_app, then call get_app() to get the combined application

app = FastAPI(title="Agno Research Assistant")

app.include_router(health_router)
app.include_router(research_router)


agent_os = build_agent_os(app)
app = agent_os.get_app()
