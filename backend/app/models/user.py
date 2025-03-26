from typing import List, Optional
from beanie import Document, Indexed, Link
from pydantic import Field
from app.models.metadata import MetaData 

class User(Document):
    username: str
    email: str
    password: str
    metadata: List[Link[MetaData]] = Field(default_factory=list)

    class Settings:
        name = "users"
        unique_field = ["username","email"]