import os
import uuid
import json
import shutil
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
from datetime import datetime, timezone

# Create directory structure
def create_directory_structure():
    base_dir = "iceberg_dataset"
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)
    
    os.makedirs(base_dir)
    os.makedirs(f"{base_dir}/data")
    os.makedirs(f"{base_dir}/metadata")
    
    return base_dir

# Generate dummy sales data
def generate_dummy_data(num_records=1000):
    data = {
        'customer_id': [uuid.uuid4().hex[:8] for _ in range(num_records)],
        'product_id': [f"PROD-{i % 100:03d}" for i in range(num_records)],
        'transaction_date': [datetime.now(timezone.utc) for _ in range(num_records)],
        'amount': [round(float(i % 100) * 10.5, 2) for i in range(num_records)],
        'quantity': [i % 10 + 1 for i in range(num_records)],
        'store_id': [f"STORE-{i % 20:02d}" for i in range(num_records)]
    }
    return pd.DataFrame(data)

# Write parquet files (data files)
def write_parquet_files(base_dir, df):
    file_paths = []
    
    # Split dataframe into 4 parts for multiple files
    chunk_size = len(df) // 4
    for i in range(4):
        start_idx = i * chunk_size
        end_idx = None if i == 3 else (i + 1) * chunk_size
        
        chunk = df.iloc[start_idx:end_idx]
        file_path = f"{base_dir}/data/part-{i:05d}.parquet"
        
        # Convert to pyarrow table and write
        table = pa.Table.from_pandas(chunk)
        pq.write_table(table, file_path)
        
        file_paths.append({
            "path": file_path.replace(f"{base_dir}/", ""),
            "file_size_in_bytes": os.path.getsize(file_path),
            "record_count": len(chunk),
            "partition": {}
        })
    
    return file_paths

# Create schema file
def create_schema(base_dir):
    schema = {
        "type": "struct",
        "schema-id": 0,
        "fields": [
            {"id": 1, "name": "customer_id", "required": True, "type": "string"},
            {"id": 2, "name": "product_id", "required": True, "type": "string"},
            {"id": 3, "name": "transaction_date", "required": True, "type": "timestamp"},
            {"id": 4, "name": "amount", "required": True, "type": "double"},
            {"id": 5, "name": "quantity", "required": True, "type": "int"},
            {"id": 6, "name": "store_id", "required": True, "type": "string"}
        ]
    }
    
    with open(f"{base_dir}/metadata/schema.json", "w") as f:
        json.dump(schema, f, indent=2)
    
    return schema

# Create manifest file
def create_manifest(base_dir, file_paths):
    manifest = {
        "manifest-list": {
            "entries": [
                {
                    "manifest_path": "metadata/manifest.json",
                    "manifest_length": 0,  # Will update later
                    "partition_spec_id": 0,
                    "added_snapshot_id": 1,
                    "added_data_files_count": len(file_paths),
                    "existing_data_files_count": 0,
                    "deleted_data_files_count": 0,
                    "partitions": []
                }
            ]
        }
    }
    
    # Create the actual manifest with file entries
    data_manifest = {
        "manifest": {
            "manifest-version": 1,
            "snapshot-id": 1,
            "format-version": 2,
            "schema-id": 0,
            "partition-spec-id": 0,
            "content": "data",
            "entries": file_paths
        }
    }
    
    with open(f"{base_dir}/metadata/manifest.json", "w") as f:
        json.dump(data_manifest, f, indent=2)
    
    # Update the manifest length
    manifest_size = os.path.getsize(f"{base_dir}/metadata/manifest.json")
    manifest["manifest-list"]["entries"][0]["manifest_length"] = manifest_size
    
    with open(f"{base_dir}/metadata/manifest-list.json", "w") as f:
        json.dump(manifest, f, indent=2)

# Create snapshots file
def create_snapshots(base_dir):
    current_time_ms = int(datetime.now().timestamp() * 1000)
    
    snapshots = {
        "snapshots": [
            {
                "snapshot-id": 1,
                "timestamp-ms": current_time_ms,
                "summary": {
                    "operation": "append",
                    "added-data-files": "4",
                    "total-data-files": "4",
                    "total-records": "1000",
                    "total-files-size": "45000"  # Approximate
                },
                "manifest-list": "metadata/manifest-list.json",
                "schema-id": 0
            }
        ],
        "current-snapshot-id": 1
    }
    
    with open(f"{base_dir}/metadata/snapshots.json", "w") as f:
        json.dump(snapshots, f, indent=2)

# Create table metadata
def create_table_metadata(base_dir):
    current_time_ms = int(datetime.now().timestamp() * 1000)
    
    metadata = {
        "format-version": 2,
        "table-uuid": str(uuid.uuid4()),
        "location": "s3://example-bucket/iceberg-table",
        "last-sequence-number": 1,
        "last-updated-ms": current_time_ms,
        "last-column-id": 6,
        "schema": {
            "type": "struct",
            "schema-id": 0,
            "fields": [
                {"id": 1, "name": "customer_id", "required": True, "type": "string"},
                {"id": 2, "name": "product_id", "required": True, "type": "string"},
                {"id": 3, "name": "transaction_date", "required": True, "type": "timestamp"},
                {"id": 4, "name": "amount", "required": True, "type": "double"},
                {"id": 5, "name": "quantity", "required": True, "type": "int"},
                {"id": 6, "name": "store_id", "required": True, "type": "string"}
            ]
        },
        "current-schema-id": 0,
        "partition-spec": [],
        "default-spec-id": 0,
        "partition-specs": [{"spec-id": 0, "fields": []}],
        "last-partition-id": 0,
        "properties": {
            "write.parquet.compression-codec": "snappy",
            "write.object-storage.enabled": "true",
            "write.data.path": "s3://example-bucket/iceberg-table/data"
        },
        "current-snapshot-id": 1,
        "snapshots": [
            {
                "snapshot-id": 1,
                "timestamp-ms": current_time_ms,
                "summary": {
                    "operation": "append",
                    "added-data-files": "4",
                    "total-records": "1000"
                },
                "manifest-list": "metadata/manifest-list.json",
                "schema-id": 0
            }
        ],
        "snapshot-log": [
            {"snapshot-id": 1, "timestamp-ms": current_time_ms}
        ],
        "metadata-log": []
    }
    
    with open(f"{base_dir}/metadata/v1.metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

# Create version hint file
def create_version_hint(base_dir):
    with open(f"{base_dir}/metadata/version-hint.text", "w") as f:
        f.write("1")

# Create zip file
def create_zip(base_dir):
    shutil.make_archive("iceberg_dataset", "zip", base_dir)
    shutil.rmtree(base_dir)
    print(f"Created iceberg_dataset.zip")

def main():
    base_dir = create_directory_structure()
    df = generate_dummy_data()
    file_paths = write_parquet_files(base_dir, df)
    create_schema(base_dir)
    create_manifest(base_dir, file_paths)
    create_snapshots(base_dir)
    create_table_metadata(base_dir)
    create_version_hint(base_dir)
    create_zip(base_dir)
    
    print("Iceberg dataset created successfully!")

if __name__ == "__main__":
    main()