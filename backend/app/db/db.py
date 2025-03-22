import os
from urllib.parse import urlparse 
from sqlalchemy.ext.asyncio import create_async_engine,AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import asyncio
from app.models.metadata import Base

load_dotenv()

db_url = urlparse(os.getenv('DB_URL'))

engine = create_async_engine(f"postgresql+asyncpg://{db_url.username}:{db_url.password}@{db_url.hostname}{db_url.path}?ssl=require",echo=True)

AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# This is a convention to yeild the session maker to access it in other files
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# asyncio.run(init_db())

async def close_db():
    await engine.dispose()































## This is test code to connect to neon

# async def connect_db()->None:
#     try:
#         async with engine.connect() as connection:
#             result = await connection.execute(sqlalchemy.text("SELECT 'hello world'"))
#             print(result.all())
#     except Exception as e:
#         print("Error connecting to the database - ",e)
#     finally:
#         await engine.dispose()

# asyncio.run(connect_db())
