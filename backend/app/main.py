from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Literal, Union
from datetime import datetime
from app.services.metadata_extractor.parquet import get_metadata_parquet
from app.services.metadata_extractor.iceberg import get_metadata_iceberg
from app.db.db import get_db,close_db
from sqlalchemy import text
import asyncio

app = FastAPI(title="Baadal Lens API")


class MetadataRequestAWS(BaseModel):
    file_type: Literal["parquet", "iceberg", "delta", "hudi"]
    file_path: str = Field(..., pattern=r"^s3://[a-zA-Z0-9./_-]+$")
    is_protected: bool
    iam_access_id: str
    iam_secret_access_key: str
    region_name: str
    bucket_name: str

class MetadataResponse(BaseModel):
    metadata: Union[dict, list]
    status: int
    server_timestamp: datetime


@app.get("/")
async def root():
    return {"message": "Welcome to Baadal Lens API"}

@app.get("/frontend")
async def serve_frontend():
    return {"Hello Frontend"}
    

@app.post("/api/aws/metadata", response_model=MetadataResponse)
async def retrieve_metadata(request: MetadataRequestAWS):
    try:
        params = {
            "file_type": request.file_type,
            "file_path": request.file_path,
            "is_protected": request.is_protected,
            "region_name": request.region_name,
            "bucket_name": request.bucket_name,
            "iam_access_id": request.iam_access_id,
            "iam_secret_access_key": request.iam_secret_access_key
        }
        metadata = []
        if request.file_type == "parquet":
            print("here")
            unified_metadata_parquet = get_metadata_parquet(aws_access_key_id=params["iam_access_id"], aws_secret_access_key=params["iam_secret_access_key"], region_name=params["region_name"], bucket_name=params["bucket_name"])

            return MetadataResponse(
                metadata=unified_metadata_parquet,
                status=200,
                server_timestamp=datetime.now()
            )
        
        elif request.file_type == "iceberg":
            unified_metadata_iceberg = get_metadata_iceberg(aws_access_key_id=params['iam_access_id'], aws_secret_access_key=params["iam_secret_access_key"], region_name=params["region_name"], bucket_name=params["bucket_name"])
            return MetadataResponse(
                metadata=unified_metadata_iceberg,
                status=200,
                server_timestamp=datetime.now()
            )
        
        else:
            return []
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/run-query')
async def run_query():
    async for session in get_db():
        result = await session.execute(text("SELECT 'Hello from Neon'"))
        data = result.scalar()
        return {"message":data}
    return "worked"
