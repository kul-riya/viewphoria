import boto3
import json

def get_delta_metadata(access_key: str, secret_key: str, region_name: str, bucket_name: str):
    
    # Validate input parameters
    if not (access_key and secret_key and region_name and bucket_name):
        print("Invalid Credentials")
        return
    
    # Initialize S3 Client
    s3 = boto3.client(
        "s3",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region_name
    )

    delta_prefix = "delta_lake/_delta_log/"
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=delta_prefix)
    json_files = sorted(
        [obj["Key"] for obj in response.get("Contents", []) if obj["Key"].endswith(".json")]
    )

    print("Delta log files:", json_files)

    if not json_files:
        print("No JSON files found in _delta_log/")
        return

    latest_json_file = json_files[-1]
    print(f"Reading: {latest_json_file}")

    log_obj = s3.get_object(Bucket=bucket_name, Key=latest_json_file)
    log_content = log_obj["Body"].read().decode("utf-8")

    print("Raw JSON content from S3:\n", log_content[:500])  

    # JSON Parsing
    try:
        log_entries = [json.loads(line) for line in log_content.strip().split("\n")]
        return log_entries
    except json.JSONDecodeError as e:
        print("JSON Decode Error:", e)
        return None

# Call function
log_data = get_delta_metadata(access_key="AKIA6IY36GTNWUWIDX4B", secret_key="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", region_name="ap-south-1", bucket_name="csi-fries")
