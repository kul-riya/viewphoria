import os
import json
import pyarrow as pa
import pyarrow.parquet as pq
import shutil

# Define Delta Lake folder structure
delta_folder = "delta_lake_test"
delta_log_folder = os.path.join(delta_folder, "_delta_log")
data_folder = os.path.join(delta_folder, "year=2023/month=1")

# Ensure directories exist
os.makedirs(delta_log_folder, exist_ok=True)
os.makedirs(data_folder, exist_ok=True)

# Create sample Parquet data file
data = pa.table({
    "id": [1, 2, 3],
    "name": ["Alice", "Bob", "Charlie"],
    "year": [2023, 2023, 2023],
    "month": [1, 1, 1]
})

parquet_file_path = os.path.join(data_folder, "part-00000-abcdef.snappy.parquet")
pq.write_table(data, parquet_file_path)

# Create a sample JSON transaction log
transaction_log = {
    "metaData": {
        "id": "1234567890abcdef",
        "format": "parquet",
        "schemaString": json.dumps({
            "fields": [
                {"name": "id", "type": "integer"},
                {"name": "name", "type": "string"},
                {"name": "year", "type": "integer"},
                {"name": "month", "type": "integer"}
            ]
        }),
        "partitionColumns": ["year", "month"]
    },
    "actions": [
        {
            "add": {
                "path": "year=2023/month=1/part-00000-abcdef.snappy.parquet",
                "size": os.path.getsize(parquet_file_path),
                "modificationTime": 1700000000000,
                "dataChange": True
            }
        }
    ]
}

json_log_path = os.path.join(delta_log_folder, "00000000000000000000.json")
with open(json_log_path, "w") as f:
    json.dump(transaction_log, f, indent=4)

# Zip the folder for easy download
zip_path = "delta_lake_test.zip"
shutil.make_archive(zip_path.replace(".zip", ""), 'zip', delta_folder)

# Return the zip file path
zip_path
