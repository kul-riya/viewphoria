from fastapi import FastAPI, HTTPException,Depends
from app.api.routes.metadata import router as metadata_router
from pydantic import BaseModel, Field
from typing import Literal, Union
from datetime import datetime
from app.services.metadata_extractor.parquet import get_metadata_parquet
from app.services.metadata_extractor.iceberg import get_metadata_iceberg
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.db import get_db,close_db
from sqlalchemy import text

app = FastAPI(title="Baadal Lens API")
app.include_router(metadata_router)


@app.get("/")
async def root():
    return {"message": "Welcome to Baadal Lens API"}

@app.get("/frontend")
async def serve_frontend():
    return {"Hello Frontend"}
    

@app.get('/run-query')
async def run_query():
    session:AsyncSession = await Depends(get_db)
    result = await session.execute(text("SELECT 'Hello from Neon'"))
    data = result.scalar()
    return {"message":data}

