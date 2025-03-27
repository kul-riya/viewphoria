
from app.models.metadata import MetaData
from app.models.user import User

    async def create_metadata(meta_data:MetaData):
    try:
        new_metadata = MetaData(bucket_name=meta_data.bucket_name,aws_object_id=meta_data.aws_object_id,file_type=meta_data.file_type,meta_data=meta_data.meta_data)
        await new_metadata.insert()
        return new_metadata
    except Exception as e:
        print(str(e))
        return None
