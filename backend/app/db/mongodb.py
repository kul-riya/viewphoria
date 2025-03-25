# import os
# from dotenv import load_dotenv
# import asyncio
# from motor.motor_asyncio import AsyncIOMotorClient
# from beanie import init_beanie
# from typing import List, Optional
# from beanie import Document, Indexed, Link
# from pydantic import Field


# class MetaData(Document):
#     bucket_name: str
#     aws_object_id: str
#     meta_data: List[Any] = Field(default_factory=list)

#     class Settings:
#         name = "metadata"

# class User(Document):
#     username: str
#     email: str
#     password: str
#     metadata: List[Link[MetaData]] = Field(default_factory=list)

#     class Settings:
#         name = "users"
#         unique_field = ["username","email"]


# load_dotenv()

# db_url = os.getenv('MONGO_URL')
# print(db_url)


# async def init_db():
#     client = AsyncIOMotorClient(db_url)  
#     db = client.my_database
#     await init_beanie(database=db,document_models=[User, MetaData])

# async def create_user():
#     user = User(username="Alice", email="alice@example.com", password="123456",metadata=[])
#     await user.insert()  # Saves to MongoDB
#     return user

# async def achieve():
#     await init_db()
#     res = await create_user()
#     print(res)

# asyncio.run(achieve())
