import boto3
import pyarrow.parquet as pq
import io
from services.standardizer import metadata_standardizer

def get_parquet_metadata(access_key : str, secret_key : str, region_name : str, bucket_name : str):
    
    if not(access_key and secret_key and region_name and bucket_name):
        print("Not enough data provided!")
        return
    
    meta = []

    # Create S3 Client
    s3 = boto3.client(
        "s3",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name= region_name,
    )

    #  List objects in bucket
    objects_list = s3.list_objects_v2(Bucket=bucket_name)

    # Extracting Parquet files
    parquet_files = [
        obj["Key"] for obj in objects_list.get("Contents", []) if obj["Key"].endswith(".parquet")
    ]

    # for each parquet key, extracting metadata
    for parquet_key in parquet_files:
        # Get the object from S3
        response = s3.get_object(Bucket=bucket_name, Key=parquet_key)

        # Read the object into memory as a BytesIO stream
        parquet_file = io.BytesIO(response["Body"].read())

        # Load Parquet metadata
        pq_file = pq.ParquetFile(parquet_file)

        meta.append(pq_file.metadata.to_dict())
        # # Printing Metadata
        # print("\nParquet Metadata")
        # print(pq_file.metadata)

        # print("\nSchema:")
        # print(pq_file.schema)

        # print("\nNumber of Rows:", pq_file.metadata.num_rows)
        # print("Number of Columns:", pq_file.metadata.num_columns)
        # print("Row Groups:", pq_file.num_row_groups)

        # # Extract column names
        # column_names = [pq_file.schema.names[i] for i in range(len(pq_file.schema.names))]
        # print("\n Column Names:", column_names
    metadata_standardizer(file_format="parquet", metadata=meta, bucket=bucket_name)
    return meta


get_parquet_metadata(access_key="AKIA6IY36GTNWUWIDX4B", secret_key="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", region_name="ap-south-1", bucket_name="csi-fries")
