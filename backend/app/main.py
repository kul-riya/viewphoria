from fastapi import FastAPI
import uvicorn
from api.routes.metadata import metadatarouter

class ApiServer:
    def __init__(self):
        self.app = FastAPI()

        self.app.include_router(metadatarouter, prefix="/metadata")
        
        @self.app.get("/")
        async def read_root():
            return {"Hello World"}
        
    def run(self, host="0.0.0.0", port=8000):
        uvicorn.run(self.app, host=host, port=port)

server = ApiServer()

if __name__ == "__main__":
    server.run()