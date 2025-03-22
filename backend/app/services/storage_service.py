from app.models.metadata import Metadata
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.db import get_db
from fastapi import Depends

async def create_metadata(metadata:Metadata,db:AsyncSession = Depends(get_db)):
    new_metadata = Metadata(id=metadata.id,file_type=metadata.file_type,object_id_aws=metadata.object_id_aws,meta_data=metadata.meta_data,Bucket_name=metadata.Bucket_name)
    db.add(new_metadata)
    await db.commit()
    await db.refresh(new_metadata)
    return new_metadata

