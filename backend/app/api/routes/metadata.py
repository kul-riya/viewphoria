from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_metadata():
    return {"message": "Metadata API"}
