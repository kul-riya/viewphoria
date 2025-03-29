import boto3
import json
import sys
import fastavro
from pathlib import Path
from io import BytesIO
from fastapi import HTTPException
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from schema.metadata import *

def parse_avro_link(link:str):
    
    link = link.split("/")
    file_name = link[len(link)-1]
    return file_name

def read_avro(s3_client,bucket_name,avro_file):

    response = s3_client.list_objects_v2(Bucket=bucket_name)
    records = []
    if 'Contents' in response:
        for obj in response['Contents']:
            if (obj['Key'].endswith(avro_file)):
                response = s3_client.get_object(Bucket="segfaultsurvivor", Key=obj['Key'])
                avro_bytes = BytesIO(response['Body'].read())
                reader = fastavro.reader(avro_bytes)
                records = [record for record in reader] 
        return records


def metada_data_standardizer_iceberg(metadata,location,s3_client):
    unified_metadata = []
    for idx,metadata_json in enumerate(metadata):
        table_location = metadata_json.get("location", "")
        table_info = DataInfo(
                name=metadata_json.get("name", f"Iceberg_Table_{idx + 1}"),
                location=table_location,
                format="iceberg",
                version=metadata_json.get("format-version", "Unknown")
            )

        schema_fields = []
        for schema in metadata_json.get("schemas", []):
            all_fields = schema.get("fields", [])
            for field in all_fields:
                schema_fields.append(SchemaField(
                    name=field.get("name", "Unknown"),
                    type=field.get("type", "Unknown"),
                    required=field.get("required", False),
                    min_value=field.get("min_value", None),
                    max_value=field.get("max_value", None)
                ))
        table_schema = TableSchema(fields=schema_fields, evolution_supported=True)

        snapshot_meta = []
        manifest_list_latest = ""
        timestamp_latest = ""
        for snapshot in metadata_json.get("snapshots", []):
            snapshot_meta.append(SnapshotMeta(
                snapshot_id=str(snapshot.get("snapshot-id", "Unknown")),
                timestamp=snapshot.get("timestamp-ms", "Unknown"),
                operation=snapshot.get("summary", "Unknown").get("operation", "Unknown"),
                added_files=int(snapshot.get("summary", "Unknown").get("added-data-files", 0)),
                total_size_bytes=int(snapshot.get("summary", "Unknown").get("total-files-size", 0)),
                total_records=int(snapshot.get("summary", "Unknown").get("total-records", 0)),
                changed_partition_count=int(snapshot.get("summary", "Unknown").get("changed-partition-count", 0)),
                deleted_files=int(snapshot.get("summary", "Unknown").get("total-delete-files", 0)),
                modified_files=int(snapshot.get("summary", "Unknown").get("total-modified-files", 0))
                ))
            manifest_list_latest = snapshot.get("manifest-list", "")
            timestamp_latest = snapshot.get("timestamp-ms", "")
        
        files_metadata = []
        first_avro_filedata = read_avro(s3_client,bucket_name="segfaultsurvivor",avro_file=parse_avro_link(manifest_list_latest))
        
        second_avro_file = first_avro_filedata[0].get("manifest_path", [])
        second_avro_filedata = read_avro(s3_client,bucket_name="segfaultsurvivor",avro_file=parse_avro_link(second_avro_file))
        
        snapshot_file = []
        partition_columns_overall = []
        for individual_file_data in second_avro_filedata:

            file_path = individual_file_data.get("data_file","Unknown").get("file_path","Unknown")
            file_format = individual_file_data.get("data_file", "Unknown").get("file_format", "Unknown")
            file_size = individual_file_data.get("data_file", "Unknown").get("file_size_in_bytes", 0)
            partition_columns = []
            if(type(individual_file_data.get("data_file", "Unknown").get("partition", "Unknown")) == dict):
                partition_columns.append(PartitionColumn(
                    field_id=individual_file_data.get("field_id", None),
                    name=str([alp for alp in individual_file_data.get("data_file", "Unknown").get("partition", "Unknown").keys()]),
                    value=([alp for alp in individual_file_data.get("data_file", "Unknown").get("partition", "Unknown").values()]),
                    type=str(individual_file_data.get("data_file", "Unknown").get("file_format", "Unknown")),
                ))
                partition_columns_overall.append(PartitionColumn(
                    field_id=individual_file_data.get("field_id", None),
                    name=str([alp for alp in individual_file_data.get("data_file", "Unknown").get("partition", "Unknown").keys()]),
                    value=([alp for alp in individual_file_data.get("data_file", "Unknown").get("partition", "Unknown").values()]),
                    type=str(individual_file_data.get("data_file", "Unknown").get("file_format", "Unknown")),
                ))
            
            snapshot_file.append(SnapshotFile(
                snapshot_id=str(individual_file_data.get("snapshot_id", "Unknown")),
                timestamp=timestamp_latest,
                operation=individual_file_data.get("operation", "Unknown"),
                added_records=individual_file_data.get("added_records", 0),
                deleted_records=individual_file_data.get("deleted_records", 0),
                modified_records=individual_file_data.get("modified_records", 0)
            ))

            files_metadata.append(FileMetaData(
                file_path=file_path,
                format=file_format,
                size_bytes=file_size,
                partition=Partitioning(type="list",columns=partition_columns),
                snapshot=snapshot_file
            ))
        
        partioning_overall = Partitioning(type="list",columns=partition_columns_overall)
        
        unified_metadata = (UnifiedMetaData(
            link=location,
            info=table_info,
            schema=table_schema,
            partitioning=partioning_overall,
            snapshot_timeline=snapshot_meta,
            files=files_metadata
        ).model_dump())
    return unified_metadata


def get_metadata_iceberg(region_name:str,aws_access_key_id:str,aws_secret_access_key:str,bucket_name:str,folder_name):

    # This would list all the objects inside the iceberg i.e all the files which are present by scanning it recursively.
    # In the next step, I just extract all the files(objects) which end with .metadata.json as that is supposed to be unique
    #Then the metadata is parsed accordingly
    if(folder_name==""):
        raise HTTPException(status_code=402, detail="Folder name cannot be empty")

    s3_client = boto3.client('s3',region_name=region_name,aws_access_key_id=aws_access_key_id,aws_secret_access_key=aws_secret_access_key)
    response = s3_client.list_objects_v2(Bucket=bucket_name)
    r1 = list()
    list_of_metadata_files = list()
    val = ""
    required_metadata=""
    if 'Contents' in response:
        for obj in response['Contents']:
            if (obj['Key'].endswith('metadata.json') and obj['Key'].startswith(folder_name)):
                val = obj['Key']
                list_of_metadata_files.append(val)
        list_of_metadata_files.sort(reverse=True)
        if(len(list_of_metadata_files)==0):
            return r1
        required_metadata = list_of_metadata_files[0]
        try:
            response = s3_client.get_object(Bucket=bucket_name, Key=required_metadata)
            metadata_content = response['Body'].read().decode('utf-8')
            metadata_json = json.loads(metadata_content)
            r1.append(metadata_json)
        except Exception as e:
            print(str(e))
            return None
        r1 = metada_data_standardizer_iceberg(r1,required_metadata,s3_client)
    return r1
