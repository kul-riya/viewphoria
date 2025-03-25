import json
from fastapi import FastAPI
from app.api.routes.metadata import router as metadata_router
from app.api.routes.auth import router as auth_router
from app.db.db import init_db

app = FastAPI(title="Baadal Lens API")
app.include_router(metadata_router)
app.include_router(auth_router)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to Baadal Lens API"}

@app.get("/frontend")
async def serve_frontend():
    return {"Hello Frontend"}
    

# @app.get('/run-query')
# async def run_query(db: AsyncSession = Depends(get_db)):
#     try:
#         with open('v1.metadata.json') as f:
#             data = json.load(f)
#             id = str(uuid.uuid4())
#             file_type = "iceberg"
#             object_id_aws = "s3://segfaultsurvivor//content/iceberg_warehouse/default/cancer_table"
#             Bucket_name = "segfaultsurvivor"
#             new_data = Meta_data(id=id,file_type=file_type,object_id_aws=object_id_aws,meta_data=data,Bucket_name=Bucket_name)
#             res = await create_metadata(new_data,db)
#             return "Hello"
#     except Exception as e:
#         print(e)
#         return ""
    