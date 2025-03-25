from typing import List, Optional, Any
from beanie import Document, Link
from pydantic import Field
from bson import ObjectId

class MetaData(Document):
    bucket_name: str
    aws_object_id: str
    file_type: str
    meta_data: Any = Field(default_factory=dict)
    class Settings:
        name = "metadata"