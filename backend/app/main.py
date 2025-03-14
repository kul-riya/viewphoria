from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.routes.metadata import router as metadata_router

app = FastAPI(title="Baadal Lens API")


# API routes
app.include_router(metadata_router, prefix="/metadata", tags=["Metadata"])


@app.get("/")
async def root():
    return {"message": "Welcome to Baadal Lens API"}

@app.get("/frontend")
async def serve_frontend():
    return {"Hello Frontend"}
