from typing import List, Optional, Any
from beanie import Document, Link
from pydantic import Field
from bson import ObjectId
from app.models.user import User

class MetaData(Document):
    bucket_name: str
    aws_object_id: str
    meta_data: List[Any] = Field(default_factory=list)
    class Settings:
        name = "metadata"