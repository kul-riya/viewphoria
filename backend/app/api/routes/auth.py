from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from app.services.auth_service import user_login,user_signup
from app.services.token import create_token

class userLogin(BaseModel):
    email: str
    password: str

class userSignup(BaseModel):
    email: str
    password: str
    username: str

router = APIRouter(prefix="/api")

# @router.post("/auth/login")
# async def login(request: userLogin):
#     email = request.email
#     password = request.password

@router.post("/auth/signup")
async def signup(request: userSignup):
    savedUser = await user_signup(request.email,request.password,request.username)
    print(savedUser.id)
    return {"status":200,"message":"User created successfully","token":create_token({"id":str(savedUser.id)})}


@router.post("/auth/login")
async def login(request: userLogin):
    email = request.email
    password = request.password
    foundUser = await user_login(email,password)
    return {"status":200,"message":"User logged in successfully","token":create_token({"id":str(foundUser.id)})}
