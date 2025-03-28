import json
from pydantic import BaseModel
from typing import List, Dict, Optional, Union
from app.schema.metadata import *

def metadata_standardizer(file_format: str, metadata: List, bucket: str):
    '''Documentation:
    This function standardizes the outputs of metadata files into a Unified Metadata Schema (UMS)

    Arguments:
    file_format: Accepts {"parquet", "iceberg", "hudi", "delta"}
    metadata: The extracted metadata as a list from cloud providers
    bucket: The name of the bucket which holds the file_format

    Returns:
    An optimized Unified Metadata Model (UMM) consisting of key parameters to visualize key components of the file_format
    '''
    unified_metadata_list = []

    if file_format == "parquet":
        for idx, file_meta in enumerate(metadata):
            table_info = DataInfo(
                name=f"Parquet_File_{idx+1}",
                format="parquet",
                location= file_meta["location"],
                created_by=file_meta.get("created_by", "Unknown"),
                version=file_meta.get("format_version", "Unknown")
            )

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
            file_path = f"s3://{bucket}/file_{idx+1}.parquet"

            unified_metadata = UnifiedMetaData(
                link=file_path,
                table=table_info,
                schema=table_schema,
                files=[FileMetaData(
                    file_path=file_path,
                    format="parquet",
                    size_bytes=file_meta.get("serialized_size", 0),
                    row_count=file_meta.get("num_rows", 0),
                    row_groups=row_groups
                )]
            )

            unified_metadata_list.append(unified_metadata.model_dump())
        return unified_metadata_list

    elif file_format == "delta":
        unified_metadata_list = []
        if not metadata:
            return unified_metadata_list
        
        #Here we extract the keys
        meta_data = next((entry for entry in metadata if "metaData" in entry), None)
        add_files = [entry["add"] for entry in metadata if "add" in entry]
        remove_files = [entry["remove"] for entry in metadata if "remove" in entry]
        commit_info = next((entry for entry in metadata if "commitInfo" in entry), None)
        protocol = next((entry for entry in metadata if "protocol" in entry), None)

        # This is the table info
        table_location =  f"s3://{bucket}/delta_lake"
        table_name = meta_data["metaData"].get("name", "")
        table_info = DataInfo(
            name=table_name,
            location=table_location,
            format="delta",
            version=str(len(json_files)) if 'json_files' in locals() else "Unknown" # Json length = version 
        )

        # Schema Field
        schema_fields = []
        if meta_data and "schemaString" in meta_data["metaData"]:
            schema_json = json.loads(meta_data["metaData"]["schemaString"])
            for field in schema_json["fields"]:
                schema_fields.append(SchemaField(
                    name=field.get("name", "Unknown"),
                    type=field.get("type", "Unknown"),
                    required=not field.get("nullable", True),
                    min_value = None,
                    max_value = None
                ))
            
            table_schema = TableSchema(
                fields=schema_fields,
                evolution_supported=True
            )

        #Partitioning
        partition_columns = []
        if meta_data and "partitionColumns" in meta_data["metaData"]:
            for col_name in meta_data["metaData"]["partitionColumns"]:

                field_type="Unknown"
                for field in schema_fields:
                    if field.name == col_name:
                        field_type = field.type
                        break
                partition_columns.append(PartitionColumn(
                    name=col_name,
                    type=field_type
                ))
                
            partitioning = Partitioning(
                type="range" if partition_columns else None,
                columns=partition_columns
            )

            # Snapshots
            snapshots_list = []
            if commit_info:
                snapshot = SnapshotFile(
                    snapshot_id=str(commit_info["commitInfo"].get("timestamp", "")),
                    timestamp=str(commit_info["commitInfo"].get("timestamp", "")),
                    operation=commit_info["commitInfo"].get("operation", "unknown"),
                    added_files=len(add_files),
                    deleted_files=len(remove_files),
                    modified_files=0, # Delta cannot track modified files and ye field 0 rakhna hoga
                    manifest_list=None # Delta does not have Manifest Lists as Iceberg
                )
                snapshots_list.append(snapshot)

            # Files and Row Groups
            files_list = []
            for add_file in add_files:
                stats = json.loads(add_file.get("stats", "{}"))
                row_group = RowGroup(
                    row_count=stats.get("numRecords", 0),
                    size_bytes=add_file.get("size", 0),
                    min_values=stats.get("minValues", {}),
                    max_values=stats.get("maxValues", {}),
                    null_counts=stats.get("nullCount", {})
                )
                file_path = add_file["path"]
                if not file_path.startswith("s3://"):
                    file_path = f"s3://{bucket}/delta_lake/{file_path}"
                    
                files_list.append(FileMetaData(
                    file_path=file_path,
                    format="parquet", # delta uses parquet
                    size_bytes=add_file.get("size", 0),
                    row_count=stats.get("numRecords", 0),
                    row_groups=[row_group]
                ))
                
            # MetaData Misc Files here
            delta_log_files = [f"s3://{bucket}/delta_lake/_delta_log/{f.split('/')[-1]}" for f in json_files] if 'json_files' in locals() else []
            metadata_files = FileMetaData(
                delta_log=delta_log_files,
            )

            # Table Properties
            properties = TableProperties(
                write_format_default="parquet",
                compression=meta_data["metaData"].get("configuration", {}).get("delta.parquet.compression", "SNAPPY"),
                created_by=None,
                compaction_enabled=meta_data["metaData"].get("configuration", {}).get("delta.enableCompaction", "false").lower() == "true"
            )

            # Unified Metadata
            unified_metadata = UnifiedMetaData(
                link=table_location,
                table=table_info,
                schema=table_schema,
                partitioning=partitioning,
                snapshots=snapshots_list,
                files=files_list,
                metadata_files=metadata_files,
                properties=properties
            )
            unified_metadata_list.append(unified_metadata.model_dump())
            return unified_metadata_list
    else:
        return []
