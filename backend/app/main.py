from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.health import router as health_router
from app.api.routes.research import router as research_router
from app.agent_os import build_agent_os
from app.core.config import settings
# This pattern matches the Agno docs: create FastAPI app, add routes, pass it as base_app, then call get_app() to get the combined application

app = FastAPI(title="Agno Research Assistant")

if settings.CORS_ALLOWED_ORIGINS:
  app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

app.include_router(health_router)
app.include_router(research_router)


agent_os = build_agent_os(app)
app = agent_os.get_app()
