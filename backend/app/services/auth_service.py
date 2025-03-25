from fastapi import HTTPException,Depends,Request
import re
from dotenv import load_dotenv
from app.models.user import User
from app.services.token import validate_token
import os
import bcrypt

load_dotenv()
secret_string=os.getenv("SECRET_STRING")

def isAuthenticated(request:Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")
    token = auth_header.split("Bearer ")[1]
    isTokenValid = validate_token(token)
    if not isTokenValid:
        raise HTTPException(status_code=401, detail="Invalid token")
    return isTokenValid


async def user_signup(email:str,password:str,username:str):
    print(email)
    if(re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',email) == None):
        raise HTTPException(status_code=400, detail="Invalid email")
    foundUser =await User.find_one(User.email == email)
    print(foundUser)
    if(foundUser!=None):
        raise HTTPException(status_code=400, detail="User already exists Please Login")
    foundUser = await User.find_one(User.username == username)
    if(foundUser!=None):
        raise HTTPException(status_code=400, detail="User already exists Please Login")
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    newUser = User(email=email,password=hashed_password,username=username)
    savedUser = await newUser.save()
    return savedUser



async def user_login(email:str,password:str):
    if(re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',email) == None):
        raise HTTPException(status_code=400, detail="Invalid email")
    foundUser = await User.find_one(User.email == email)
    if(not foundUser):
        raise HTTPException(status_code=404, detail="User not found please Signup")
    passwordMatch = bcrypt.checkpw(password.encode('utf-8'), foundUser.password.encode('utf-8'))
    if(not passwordMatch):
        raise HTTPException(status_code=401, detail="Invalid Credentials, Please Try again")
    return foundUser

