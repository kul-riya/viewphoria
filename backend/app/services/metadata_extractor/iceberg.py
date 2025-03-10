import boto3
import json
async def get_metadata(region_name:str,aws_access_key_id:str,aws_secret_access_key:str):
    # s3 = boto3.resource(service_name='s3',region_name=region_name,aws_access_key_id=aws_access_key_id,aws_secret_access_key=aws_secret_access_key)
    # object_name = 'iceberg_warehouse/'
    s3_client = boto3.client('s3',region_name=region_name,aws_access_key_id=aws_access_key_id,aws_secret_access_key=aws_secret_access_key)
    bucket_name = 'segfaultsurvivor'
    # This would list all the objects inside the iceberg i.e all the files which are present by scanning it recursively.
    # In the next step, I just extract all the files(objects) which end with .metadata.json as that is supposed to be unique
    #Then the metadata is parsed accordingly
    response = s3_client.list_objects_v2(Bucket=bucket_name)
    val = ""
    if 'Contents' in response:
        for obj in response['Contents']:
            if obj['Key'].endswith('.metadata.json'):
                val = obj['Key']

    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=val)
        metadata_content = response['Body'].read().decode('utf-8')  # Read & decode
        metadata_json = json.loads(metadata_content)
        print(metadata_json)
        print(type(metadata_json),type(metadata_content))
        return metadata_json
    except Exception as e:
        print(str(e))
        return None
