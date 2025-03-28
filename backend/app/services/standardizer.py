import json
from pydantic import BaseModel
from typing import List, Dict, Optional, Union
from app.schema.metadata import *
import datetime


def metadata_standardizer(file_format: str, metadata: List, bucket: str, folder_name: str):
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
        if not metadata:
            return unified_metadata_list
        # Initialize components with defaults
        table_location = f"s3://{bucket}/{folder_name}"
        table_info = DataInfo(
            name="delta_table",  # Default name
            location=table_location,
            format="parquet",   
            version="0"          
        )
        table_schema = TableSchema(fields=[]) 
        partitioning = None
        snapshot_timeline = []
        files_dict = {}
        properties = None


        for entry in metadata:
            if "commitInfo" in entry:
                commit_info = entry["commitInfo"]
                snapshot_id = commit_info.get("txnId", str(commit_info["timestamp"]))
                timestamp = datetime.datetime.fromtimestamp(commit_info["timestamp"] / 1000).isoformat()
                operation = commit_info["operation"]
                metrics = commit_info.get("operationMetrics", {})
                snapshot_timeline.append(
                    SnapshotMeta(
                        snapshot_id=snapshot_id,
                        timestamp=timestamp,
                        operation=operation,
                        added_files=int(metrics.get("numFiles", metrics.get("numAddedFiles", 0))),
                        deleted_files=int(metrics.get("numRemovedFiles", 0)),
                        modified_files=int(metrics.get("numUpdatedRows", 0))
                    )
                )
                # Version is updated based on commits, eg if I get 3 timestamp files: The table version will be considered as 3
                table_info.version = str(len(snapshot_timeline))

            if "metaData" in entry:  
                meta_data = entry["metaData"]
                table_info = DataInfo(
                    name=meta_data.get("name", "delta_table"),
                    location=table_location,
                    format=meta_data["format"]["provider"],
                    version=str(len(snapshot_timeline))
                )

                # Schema
                schema_json = json.loads(meta_data["schemaString"])
                schema_fields = [
                    SchemaField(
                        name=field.get("name", "Unknown"),
                        type=field.get("type", "Unknown"),
                        required=not field.get("nullable", True)
                    ) for field in schema_json["fields"]
                ]
                table_schema = TableSchema(fields=schema_fields)

                # Partitioning
                partition_columns = [
                    PartitionColumn(
                        name=col,
                        type=next((f.type for f in schema_fields if f.name == col), "Unknown")
                    ) for col in meta_data["partitionColumns"]
                ]
                partitioning = Partitioning(
                    type="range" if partition_columns else None,
                    columns=partition_columns
                )

                # Properties
                properties = TableProperties(
                    write_format_default=meta_data["format"]["provider"],
                    compression=meta_data.get("configuration", {}).get("delta.parquet.compression", "SNAPPY"),
                    created_by=commit_info.get("engineInfo") if "commitInfo" in locals() else None,
                    compaction_enabled=meta_data.get("configuration", {}).get("delta.enableCompaction", "false").lower() == "true"
                )

            if "add" in entry:
                add_file = entry["add"]
                stats = json.loads(add_file.get("stats", "{}"))
                file_path = add_file["path"]
                if not file_path.startswith("s3://"):
                    file_path = f"s3://{bucket}/{folder_name}/{file_path}"
                files_dict[file_path] = FileMetaData(
                    file_path=file_path,
                    format="parquet",
                    size_bytes=add_file["size"],
                    row_count=stats.get("numRecords", 0),
                  
                    row_groups=[RowGroup(
                        row_count=stats.get("numRecords", 0),
                        size_bytes=add_file["size"],
                        min_values=stats.get("minValues", {}),
                        max_values=stats.get("maxValues", {}),
                        null_counts=stats.get("nullCount", {})
                    )],
                    snapshot=None
                )

            if "remove" in entry:
                remove_file = entry["remove"]
                file_path = remove_file["path"]
                if not file_path.startswith("s3://"):
                    file_path = f"s3://{bucket}/{folder_name}/{file_path}"
                files_dict.pop(file_path, None)

        # Unfied Metadata Model here
        unified_metadata = UnifiedMetaData(
            link=table_info.location,
            info=table_info,
            table_schema=table_schema,
            partitioning=partitioning,
            snapshot_timeline=snapshot_timeline,
            files=list(files_dict.values()),
            properties=properties
        )
        unified_metadata_list.append(unified_metadata.model_dump())
        return unified_metadata_list
    else:
        return []
