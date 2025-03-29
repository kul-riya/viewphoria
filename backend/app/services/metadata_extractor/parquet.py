import boto3
import pyarrow.parquet as pq
import io
from app.services.standardizer import metadata_standardizer
import pyarrow.fs as fs



## OFFERS A MUCH BETTER APPROACH, BUT FOR SOME REASON HAS NETWORK ERRORS WITH SOME BUCKETS
def get_metadata_parquet(aws_access_key_id: str, aws_secret_access_key: str, region_name: str, bucket_name: str, folder_name: str):
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
    objects_list = s3.list_objects_v2(Bucket=bucket_name)

    # Extracting Parquet file keys
    parquet_files = [obj["Key"] for obj in objects_list.get("Contents", []) if obj["Key"].endswith(".parquet")]

    if not parquet_files:
        print("No Parquet files found in the bucket.")
        return []

    # Initialize S3 Filesystem for efficient metadata extraction
    s3_fs = fs.S3FileSystem(region=region_name, access_key=aws_access_key_id, secret_key=aws_secret_access_key)

    meta = []
    
    for parquet_key in parquet_files:
        try:
            # Use Arrow's S3FileSystem to read metadata without loading entire file
            pq_file = pq.ParquetFile(f"{bucket_name}/{parquet_key}", filesystem=s3_fs)
            # print(pq_file)
            metadata = pq_file.metadata.to_dict() if pq_file.metadata else {}
            metadata["location"] = parquet_key
            meta.append(metadata)
            # Add filename to metadata
            # metadata["file_name"] = parquet_key

        except Exception as e:
            print(f"Error reading metadata for {parquet_key}: {e}")

    unified_metadata = metadata_standardizer(file_format="parquet", metadata=meta, bucket=bucket_name,folder_name="")

    return unified_metadata



# def get_metadata_parquet(aws_access_key_id : str, aws_secret_access_key : str, region_name : str, bucket_name : str):
    
#     if not(aws_access_key_id and aws_secret_access_key and region_name and bucket_name):
#         print("Not enough data provided!")
#         return
    
#     meta = []

#     # Create S3 Client
#     s3 = boto3.client(
#         "s3",
#         aws_access_key_id=aws_access_key_id,
#         aws_secret_access_key=aws_secret_access_key,
#         region_name= region_name,
#     )

#     #  List objects in bucket
#     objects_list = s3.list_objects_v2(Bucket=bucket_name)

#     # Extracting Parquet files
#     parquet_files = [
#         obj["Key"] for obj in objects_list.get("Contents", []) if obj["Key"].endswith(".parquet")
#     ]

#     # for each parquet key, extracting metadata
#     for parquet_key in parquet_files:
#         # Get the object from S3
#         response = s3.get_object(Bucket=bucket_name, Key=parquet_key)

#         # Read the object into memory as a BytesIO stream
#         parquet_file = io.BytesIO(response["Body"].read())

#         # Load Parquet metadata
#         pq_file = pq.ParquetFile(parquet_file)

#         pq_meta = pq_file.metadata.to_dict()
#         pq_meta["location"] = parquet_key
#         meta.append(pq_meta)
#         # # Printing Metadata
#         # print("\nParquet Metadata")
#         # print(pq_file.metadata)

#         # print("\nSchema:")
#         # print(pq_file.schema)

#         # print("\nNumber of Rows:", pq_file.metadata.num_rows)
#         # print("Number of Columns:", pq_file.metadata.num_columns)
#         # print("Row Groups:", pq_file.num_row_groups)

#         # # Extract column names
#         # column_names = [pq_file.schema.names[i] for i in range(len(pq_file.schema.names))]

#     unified_metadata = metadata_standardizer(file_format="parquet", metadata=meta, bucket=bucket_name)

#     return unified_metadata
