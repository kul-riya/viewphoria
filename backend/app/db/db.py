import os
from dotenv import load_dotenv
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import List, Optional, Any
from beanie import Document, Link
from pydantic import Field
from app.models.user import User
from app.models.metadata import MetaData


load_dotenv()
db_url = os.getenv('MONGO_URL')

async def init_db():
    print(db_url)
    client = AsyncIOMotorClient(db_url)  
    db = client.my_database
    await init_beanie(database=db,document_models=[User, MetaData])

