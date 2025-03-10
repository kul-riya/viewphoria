from fastapi import FastAPI
import uvicorn
from services.metadata_extractor.iceberg import get_metadata

class ApiServer:
    def __init__(self):
        self.app = FastAPI()

        @self.app.get("/")
        async def read_root():
            return {"Hello World"}
        
        @self.app.get('/metadata/iceberg/get_metadata')
        async def read_metadata_iceberg():
            buckets:str|None = await get_metadata(region_name='ap-south-1',aws_access_key_id='AKIAWCZC5Y5YUL6UBP34',aws_secret_access_key='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')
            return buckets
    
    def run(self, host="0.0.0.0", port=8000):
        uvicorn.run(self.app, host=host, port=port)

server = ApiServer()

if __name__ == "__main__":
    server.run()