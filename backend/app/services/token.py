import jwt
from dotenv import load_dotenv
load_dotenv()
from os import getenv

secret_string=getenv("SECRET_STRING")

def create_token(payload:dict):
    encoded_token = jwt.encode(payload, secret_string, algorithm='HS256')
    return encoded_token