import s3fs
import json

def get_delta_metadata(access_key: str, secret_key: str, region_name: str, bucket_name: str):
    
    if not (access_key and secret_key and region_name and bucket_name):
        print("Invalid Credentials")
        return
    
    # Initialize S3FS filesystem
    s3 = s3fs.S3FileSystem(
        anon=False,
        key=access_key,
        secret=secret_key,
        client_kwargs={'region_name': region_name}
    )

    delta_prefix = f"{bucket_name}/delta_lake/_delta_log/"
    # List all files in the delta log directory
    all_files = s3.ls(delta_prefix)
    json_files = sorted(
        [f for f in all_files if f.endswith('.json')]
    )

    print("Delta log files:", json_files)

    if not json_files:
        print("No JSON files found in _delta_log/")
        return

    latest_json_file = json_files[-1]
    print(f"Reading: {latest_json_file}")

    # Read the file directly using s3fs
    with s3.open(latest_json_file, 'r', encoding='utf-8') as log_file:
        log_content = log_file.read()

    print("Raw JSON content from S3:\n", log_content)

    # JSON Parsing
    try:
        log_entries = [json.loads(line) for line in log_content.strip().split("\n")]
        return log_entries
    except json.JSONDecodeError as e:
        print("JSON Decode Error:", e)
        return None
