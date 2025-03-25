import json
from fastapi import FastAPI
from app.api.routes.metadata import router as metadata_router
from app.api.routes.auth import router as auth_router
from app.db.db import init_db

app = FastAPI(title="Baadal Lens API")
app.include_router(metadata_router)
app.include_router(auth_router)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to Baadal Lens API"}

@app.get("/frontend")
async def serve_frontend():
    return {"Hello Frontend"}
