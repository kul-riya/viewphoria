import boto3
import json
import pyarrow.parquet as pq
import pyarrow.fs as fs

# from viewphoria.backend.app.services import standardizer
from schema.metadata import *


data_files = {}

def extract_hudi_commit_metadata(unified_metadata: UnifiedMetaData, aws_access_key_id: str, aws_secret_access_key: str, region_name: str, bucket_name: str, prefix:str):
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

def get_metadata_parquet(unified_metadata: UnifiedMetaData, aws_access_key_id: str, aws_secret_access_key: str, region_name: str, bucket_name: str, prefix:str):
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

    files_meta_data = []

    
    for parquet_key in parquet_files:
        try:
            # Use Arrow's S3FileSystem to read metadata without loading entire file
            pq_file = pq.ParquetFile(f"{bucket_name}/{parquet_key}", filesystem=s3_fs)
            file_meta = pq_file.metadata.to_dict() if pq_file.metadata else {}
            file_meta["location"] = parquet_key

            schema_fields = []
            if "row_groups" in file_meta and len(file_meta["row_groups"]) > 0:
                columns = file_meta["row_groups"][0]["columns"]
                for col in columns:
                    stats = col.get("statistics", {})
                    schema_fields.append(SchemaField(
                        name=col.get("path_in_schema", "Unknown"),
                        type=col.get("physical_type", "Unknown"),
                        min_value=stats.get("min"),
                        max_value=stats.get("max"),
                        compression=col.get("compression", "Unknown")
                    ))

            table_schema = TableSchema(fields=schema_fields)

            row_groups = [
                RowGroup(
                    row_count=rg["num_rows"],
                    size_bytes=rg["total_byte_size"]
                ) for rg in file_meta["row_groups"]
            ]
            file_path = parquet_key
            files_meta_data.append(FileMetaData(
                    file_path=file_path,
                    format="parquet",
                    schema=table_schema,
                    size_bytes=file_meta.get("serialized_size", 0),
                    row_count=file_meta.get("num_rows", 0),
                    row_groups=row_groups
                ))


        except Exception as e:
            print(f"Error reading metadata for {parquet_key}: {e}")






def get_base_info(unified_metadata: UnifiedMetaData, bucket, key, access_key, secret_key):

    s3_client = boto3.client(
        's3',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key
    )
    response = s3_client.list_objects_v2(Bucket=bucket, Prefix=key)
    for obj in response.get("Contents", []):
        if obj["Key"].endswith("hoodie.properties"):
            path = obj["Key"]
            response = s3_client.get_object(Bucket=bucket, Key=path)
            file_content = response['Body'].read().decode('utf-8')
            # Remove lines starting with #
            filtered_content = "\n".join(line for line in file_content.splitlines() if not line.strip().startswith("#"))

                # Try to parse as JSON if possible (most Hudi commit files are JSON)
            try:
                props = {}
                for line in file_content.splitlines():
                    line = line.strip()
                    if line and not line.startswith("#"):  # Ignore empty lines and comments
                        key, value = line.split("=", 1)  # Split only on the first '='
                        props[key] = value

                unified_metadata.DataInfo = DataInfo(name=props.get("hoodie.table.format", None), location=f"s3://{bucket}/{key}", format="hudi", version=props.get("hoodie.table.version", None),)

                return props.get("hoodie.table.base.file.format", None)
            except Exception as e:
                print(filtered_content)
                print(f"Error reading hoodie.properties for {path}: {e}")

    


def read_hudi(aws_access_key_id: str, aws_secret_access_key: str, region_name: str, bucket_name: str, prefix:str):
    unified_metadata = UnifiedMetaData()

    file_format = get_base_info(unified_metadata, aws_access_key_id,aws_secret_access_key, region_name, bucket_name, bucket_name)
    extract_hudi_commit_metadata(unified_metadata, aws_access_key_id,aws_secret_access_key, region_name, bucket_name, bucket_name)
    if file_format == "PARQUET":
        data_files["file_metadata"] = get_metadata_parquet(unified_metadata, aws_access_key_id,aws_secret_access_key, region_name, bucket_name, bucket_name)
    else:
        data_files["file_metadata"] = get_metadata_avro()

    # return standardize_hudi(aws_access_key_id,aws_secret_access_key, region_name, bucket_name, bucket_name)

if __name__ == "__main__":
    read_hudi("AKIASFIXC4X7UGDOHPX2","MSJM08lZuF07h9Cpb4TtqA++nbKyn//AbzkJwz1K", "eu-north-1", "peri-peri-fries", "hudi_trips_cow/")

