import boto3
import json
import pyarrow.parquet as pq
import pyarrow.fs as fs

from viewphoria.backend.app.services import standardizer

data_files = {}

def extract_hudi_commit_metadata(aws_access_key_id: str, aws_secret_access_key: str, region_name: str, bucket_name: str, prefix:str):
    # Initialize S3 client with the provided credentials
    s3_client = boto3.client(
        's3',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )
    
    commit_contents = []
    
    try:
        # List all objects with the given prefix
        object_list = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        # print(object_list)
        
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
                response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
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

def get_metadata_avro():
    pass

def get_metadata_parquet(aws_access_key_id: str, aws_secret_access_key: str, region_name: str, bucket_name: str, prefix:str):
    if not (aws_access_key_id and aws_secret_access_key and region_name and bucket_name):
        raise ValueError("Missing required AWS credentials or bucket name!")

    # Create S3 Client
    s3 = boto3.client(
        "s3",
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        region_name=region_name,
    )

    # List objects in bucket
    objects_list = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

    # Extracting Parquet file keys
    parquet_files = [obj["Key"] for obj in objects_list.get("Contents", []) if obj["Key"].endswith(".parquet")]

    if not parquet_files:
        print("No Parquet files found in the bucket.")
        return []

    # Initialize S3 Filesystem for efficient metadata extraction
    s3_fs = fs.S3FileSystem(region=region_name, aws_access_key_idaccess_key=aws_access_key_id, secret_key=aws_secret_access_key)

    meta = []
    
    for parquet_key in parquet_files:
        try:
            # Use Arrow's S3FileSystem to read metadata without loading entire file
            pq_file = pq.ParquetFile(f"{bucket_name}/{parquet_key}", filesystem=s3_fs)
            metadata = pq_file.metadata.to_dict() if pq_file.metadata else {}
            metadata["location"] = parquet_key
            meta.append(metadata)


        except Exception as e:
            print(f"Error reading metadata for {parquet_key}: {e}")

    return meta





def get_base_info(aws_access_key_id: str, aws_secret_access_key: str, region_name: str, bucket_name: str, prefix:str):

    s3_client = boto3.client(
        's3',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )
    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    for obj in response.get("Contents", []):
        if obj["Key"].endswith("hoodie.properties"):
            path = obj["Key"]
            response = s3_client.get_object(Bucket=bucket_name, Key=path)
            file_content = response['Body'].read().decode('utf-8')
                
                # Try to parse as JSON if possible (most Hudi commit files are JSON)
            try:
                props = json.loads(file_content)

            except Exception as e:
                print(file_content)
                print(f"Error reading hoodie.properties for {path}: {e}")

    return props






def read_hudi(aws_access_key_id: str, aws_secret_access_key: str, region_name: str, bucket_name: str, prefix:str):
    # metadata = {}
    # commit_contents = extract_hudi_commit_metadata("peri-peri-fries", "hudi_trips_cow/", "AKIASFIXC4X7UGDOHPX2","MSJM08lZuF07h9Cpb4TtqA++nbKyn//AbzkJwz1K")
    # print(commit_contents)

    # get_metadata_parquet("AKIASFIXC4X7UGDOHPX2","MSJM08lZuF07h9Cpb4TtqA++nbKyn//AbzkJwz1K", "eu-north-1", "peri-peri-fries", "hudi_trips_cow/")
    data_files["properties"] = get_base_info("AKIASFIXC4X7UGDOHPX2","MSJM08lZuF07h9Cpb4TtqA++nbKyn//AbzkJwz1K", "eu-north-1", "peri-peri-fries", "hudi_trips_cow/")
    data_files["commit_data"] = extract_hudi_commit_metadata("AKIASFIXC4X7UGDOHPX2","MSJM08lZuF07h9Cpb4TtqA++nbKyn//AbzkJwz1K", "eu-north-1", "peri-peri-fries", "hudi_trips_cow/")
    if data_files.properties["hoodie.table.base.file.format"] == "PARQUET":

        data_files["file_metadata"] = get_metadata_parquet(aws_access_key_id,aws_secret_access_key, region_name, bucket_name, bucket_name)
    else:
        data_files["file_metadata"] = get_metadata_avro()

    return standardizer()

if __name__ == "__main__":
    read_hudi("AKIASFIXC4X7UGDOHPX2","MSJM08lZuF07h9Cpb4TtqA++nbKyn//AbzkJwz1K", "eu-north-1", "peri-peri-fries", "hudi_trips_cow/")