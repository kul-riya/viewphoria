import jwt
from dotenv import load_dotenv
load_dotenv()
from os import getenv
import datetime

SECRET_STRING=getenv("SECRET_STRING")

def create_token(payload:dict):
    exp_time = datetime.datetime.now() + datetime.timedelta(hours=10)
    final_payload = {**payload,"exp": exp_time}
    encoded_token = jwt.encode(final_payload, SECRET_STRING, algorithm='HS256')
    return encoded_token

def validate_token(token:str):
    try:
        payload = jwt.decode(token, SECRET_STRING, algorithms=["HS256"])
        return payload
    except Exception as e:
        print(str(e))
        return False