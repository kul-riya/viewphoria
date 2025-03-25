from fastapi import APIRouter,Depends,HTTPException
import json
from app.db.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from pydantic import BaseModel, Field
from typing import Literal, Union
from datetime import datetime
from app.services.meta_data_main import get_metadata
from app.services.storage_service import create_metadata
from app.models.metadata import Meta_data
from app.db.db import init_db


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

router = APIRouter(prefix="/api")

@router.get("/aws/metadata")
async def fetch_metadata_aws(request: MetadataRequestAWS):
    res = await get_metadata(request)
    return res
    


@router.post("/metadata/add_metadata_to_db")
async def add_metadata_to_db(request: MetadataRequestAWS,db:AsyncSession = Depends(get_db)):
    try:
        await init_db()
        res = await get_metadata(request)
        res = dict(res)
        res = json.dumps(res, indent=4, default=str)
        id = str(uuid.uuid4())
        file_type = request.file_type
        Bucket_name = request.bucket_name
        object_id_aws = str(uuid.uuid4())
        new_data = Meta_data(id=id,file_type=file_type,object_id_aws=object_id_aws,meta_data=res,Bucket_name=Bucket_name)
        final_res = await create_metadata(new_data,db)
        print(final_res.meta_data)
        return {"status": 200, "message": "Metadata added successfully to database", "data": json.loads(final_res.meta_data)}
    except Exception as e:
        print(str(e))
        return HTTPException(status_code=400, detail="Error in adding metadata to db")
