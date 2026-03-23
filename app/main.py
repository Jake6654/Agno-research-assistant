from fastapi import FastAPI
from app.api.routes.health import router as health_router

app = FastAPI(title="Agno Research Assistant")

app.include_router(health_router)