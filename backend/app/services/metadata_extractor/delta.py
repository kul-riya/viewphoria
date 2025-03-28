import s3fs
import json
from typing import List, Optional
from app.services.standardizer import metadata_standardizer

def get_metadata_delta(access_key: str, secret_key: str, region_name: str, bucket_name: str, folder_name: str) -> Optional[List[dict]]:
    if not (access_key and secret_key and region_name and bucket_name):
        print("Invalid Credentials")
        return None
    
    try:
        s3 = s3fs.S3FileSystem(
            anon=False,
            key=access_key,
            secret=secret_key,
            client_kwargs={'region_name': region_name}
        )

        delta_prefix = f"{bucket_name}/{folder_name}/_delta_log/"
        all_files = s3.ls(delta_prefix)
        json_files = sorted([f for f in all_files if f.endswith('.json')])


        if not json_files:
            return None

        all_entries = []
        for json_file in json_files:
            print(f"Reading: {json_file}")
            with s3.open(json_file, 'r', encoding='utf-8') as log_file:
                log_content = log_file.read()

                try:
                    entries = [json.loads(line) for line in log_content.strip().split("\n")]
                    all_entries.extend(entries)
                except json.JSONDecodeError as e:
                    print(f"JSON Decode Error in {json_file}: {e}")
                    continue 

        if not all_entries:
            return None
        unified_metadata = metadata_standardizer(file_format="delta", metadata=all_entries, bucket=bucket_name, folder_name=folder_name)
        return unified_metadata

    except Exception as e:
        print(f"Error accessing S3: {e}")
        return None
