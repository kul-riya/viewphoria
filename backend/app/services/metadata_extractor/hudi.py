import boto3
import json

def extract_hudi_commit_metadata(bucket, key, access_key, secret_key):
    # Initialize S3 client with the provided credentials
    s3_client = boto3.client(
        's3',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key
    )
    
    commit_contents = []
    
    try:
        # List all objects with the given prefix
        object_list = s3_client.list_objects_v2(Bucket=bucket, Prefix=key)
        
        # Check if there are contents
        if "Contents" not in object_list:
            return commit_contents
        
        # Iterate through each object
        for obj in object_list["Contents"]:
            file_key = obj["Key"]
            
            # Check if file ends with .commit
            if file_key.endswith(".commit"):
                print(f"Found commit file: {file_key}")
                
                # Get the content of the commit file
                response = s3_client.get_object(Bucket=bucket, Key=file_key)
                file_content = response['Body'].read().decode('utf-8')
                
                # Try to parse as JSON if possible (most Hudi commit files are JSON)
                try:
                    commit_data = json.loads(file_content)
                    commit_contents.append({
                        'file_path': file_key,
                        'content': commit_data
                    })
                except json.JSONDecodeError:
                    # If not valid JSON, add as raw text
                    commit_contents.append({
                        'file_path': file_key,
                        'content': file_content
                    })
                
    except Exception as e:
        print(f"Error accessing S3: {str(e)}")
    
    return commit_contents
