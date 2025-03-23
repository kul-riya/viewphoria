from app.models.metadata import Meta_data
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.db import get_db
from fastapi import Depends

async def create_metadata(meta_data:Meta_data,db:AsyncSession):
    try:
        new_metadata = Meta_data(id=meta_data.id,file_type=meta_data.file_type,object_id_aws=meta_data.object_id_aws,meta_data=meta_data.meta_data,Bucket_name=meta_data.Bucket_name)
        db.add(new_metadata)
        await db.commit()
        await db.refresh(new_metadata)
        return new_metadata
    except Exception as e:
        print(str(e))
        return None

