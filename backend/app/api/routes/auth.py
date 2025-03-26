from fastapi import APIRouter,HTTPException,Request
from pydantic import BaseModel
from app.services.auth_service import user_login,user_signup
from app.services.token import create_token,validate_token
from app.models.user import User
from app.services.auth_service import isAuthenticated

class userLogin(BaseModel):
    email: str
    password: str

class userSignup(BaseModel):
    email: str
    password: str
    username: str

class checkAuth(BaseModel,Request):
    token:str

router = APIRouter(prefix="/api")


@router.post("/auth/signup")
async def signup(request: userSignup):
    savedUser = await user_signup(request.email,request.password,request.username)
    return {"status":200,"message":"User created successfully","token":create_token({"id":str(savedUser.id)}),"user":savedUser}


@router.post("/auth/login")
async def login(request: userLogin):
    email = request.email
    password = request.password
    foundUser = await user_login(email,password)
    return {"status":200,"message":"User logged in successfully","token":create_token({"id":str(foundUser.id)}),"user":foundUser}

@router.post("/auth/isAuthenticated")
async def check_auth(request:checkAuth):
    res = await isAuthenticated(request)
    if(res["user"]):
        return {"status":200,"data":res["user"]}
    else:
        raise HTTPException(401,detail="Unauthorized")
