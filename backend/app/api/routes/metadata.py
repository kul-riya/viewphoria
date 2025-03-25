from fastapi import APIRouter,HTTPException,Depends
import json
import uuid
from pydantic import BaseModel, Field
from typing import Literal
from app.services.meta_data_main import get_metadata
from app.services.storage_service import create_metadata
from app.models.metadata import MetaData
from app.models.user import User
from app.services.auth_service import isAuthenticated
from bson import ObjectId 

class MetadataRequestAWS(BaseModel):
    file_type: Literal["parquet", "iceberg", "delta", "hudi"]
    file_path: str = Field(..., pattern=r"^s3://[a-zA-Z0-9./_-]+$")
    is_protected: bool
    iam_access_id: str
    iam_secret_access_key: str
    region_name: str
    bucket_name: str

router = APIRouter(prefix="/api")

@router.post("/aws/metadata",dependencies=[Depends(isAuthenticated)])
async def fetch_metadata_aws(request: MetadataRequestAWS,payload:dict=Depends(isAuthenticated)):
    print(payload)
    res = await get_metadata(request)
    return res


## What my intention is to 

@router.post("/metadata/add_metadata_to_db",dependencies=[Depends(isAuthenticated)])
async def add_metadata_to_db(request: MetadataRequestAWS,payload:dict=Depends(isAuthenticated)):
    try:
        userid = payload['id']
        print(payload['id'])
        foundUser = await User.get(userid)
        print(foundUser)
        res = await get_metadata(request)
        res = dict(res)
        res = json.dumps(res, indent=4, default=str)
        file_type = request.file_type
        Bucket_name = request.bucket_name
        object_id_aws = str(uuid.uuid4())
        new_data = MetaData(file_type=file_type,aws_object_id=object_id_aws,meta_data=res,bucket_name=Bucket_name)
        final_res = await create_metadata(new_data)
        foundUser.metadata.append(final_res)
        await foundUser.save()
        return {"status": 200, "message": "Metadata added successfully to database", "data": json.loads(final_res.meta_data)}
    except Exception as e:
        print(str(e))
        return HTTPException(status_code=400, detail="Error in adding metadata to db")
