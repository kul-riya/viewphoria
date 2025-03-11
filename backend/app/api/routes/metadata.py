from fastapi import APIRouter,HTTPException
from services.metadata_extractor.iceberg import get_metadata
from pydantic import BaseModel

metadatarouter = APIRouter()

#Usage Details -> Provide the region_name,access_key, aws_secret in the request body in form python Dict.
# if all details are valid, you will recive the metadata back in response

class AWS_Credentials(BaseModel):
    region_name:str
    aws_access_key_id:str
    aws_secret_access_key:str
    bucket_name:str

@metadatarouter.get('/iceberg/get_metadata')
async def read_metadata_iceberg(credentials:AWS_Credentials):
    buckets:list[str]|None = await get_metadata(region_name=credentials.region_name,aws_access_key_id=credentials.aws_access_key_id,aws_secret_access_key=credentials.aws_secret_access_key,bucket_name=credentials.bucket_name)
    if(buckets==None):
        raise HTTPException(status_code=404, detail="Bucket not found, Please Ensure correct credentials")
    else:
        return buckets
