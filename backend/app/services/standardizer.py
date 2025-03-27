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
            table_info = TableInfo(
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

    elif file_format == "iceberg":
        for idx, metadata_json in enumerate(metadata):
            table_location = metadata_json.get("location", "")

            # Table Info
            table_info = TableInfo(
                name=metadata_json.get("name", f"Iceberg_Table_{idx + 1}"),
                location=f"s3://{bucket}/{table_location}",
                format="iceberg",
                version=metadata_json.get("format-version", "Unknown")
            )

            # Schema Fields
            schema_fields = []
            if "schema" in metadata_json and "fields" in metadata_json["schema"]:
                for field in metadata_json["schema"]["fields"]:
                    schema_fields.append(SchemaField(
                        name=field.get("name", "Unknown"),
                        type=field.get("type", "Unknown"),
                        required=not field.get("optional", False)
                    ))

            table_schema = TableSchema(fields=schema_fields, evolution_supported=True)

            # Partitioning
            partition_columns = []
            if "partition-spec" in metadata_json and "fields" in metadata_json["partition-spec"]:
                for part_field in metadata_json["partition-spec"]["fields"]:
                    field_type = "unknown"
                    for field in metadata_json["schema"]["fields"]:
                        if field.get("id") == part_field.get("source-id"):
                            field_type = field.get("type")
                            break

                    partition_columns.append(PartitionColumn(
                        name=part_field.get("name", "Unknown"),
                        type=field_type
                    ))

            partitioning = Partitioning(
                type="transform", 
                columns=partition_columns
            )

            # Snapshots
            snapshots_list = []
            if "snapshots" in metadata_json:
                for snap in metadata_json["snapshots"]:
                    snapshot_id = str(snap.get("snapshot-id", ""))
                    manifest_list_path = snap.get("manifest-list", "")

                    if manifest_list_path and not manifest_list_path.startswith("s3://"):
                        manifest_list_path = f"s3://{bucket}/{manifest_list_path}"

                    snapshot = Snapshot(
                        snapshot_id=snapshot_id,
                        timestamp=str(snap.get("timestamp-ms", "")),
                        operation=snap.get("operation", "unknown"),
                        manifest_list=manifest_list_path,
                        added_files=snap.get("summary", {}).get("added-data-files", 0),
                        deleted_files=snap.get("summary", {}).get("deleted-data-files", 0),
                        modified_files=snap.get("summary", {}).get("updated-data-files", 0),
                    )
                    snapshots_list.append(snapshot)

            # File Information
            files_list = []
            total_files = 0
            total_rows = 0
            for snap in metadata_json.get("snapshots", []):
                if "summary" in snap:
                    total_files += int(snap["summary"].get("total-data-files", 0))
                    if "total-records" in snap["summary"]:
                        total_rows += int(snap["summary"]["total-records"])

            if total_files > 0:
                files_list.append(FileMetaData(
                    file_path=f"s3://{bucket}/{table_location}/data",
                    format="parquet",  # default is parquet
                    size_bytes=0,  # To be filled later, imp!!
                    row_count=total_rows,
                    row_groups=[RowGroup(
                        row_count=total_rows,
                        size_bytes=0
                    )]
                ))

            # Table Properties
            properties = TableProperties(
                write_format_default=metadata_json.get("properties", {}).get("write.format.default", "parquet"),
                compression=metadata_json.get("properties", {}).get("write.parquet.compression-codec", "SNAPPY"),
                created_by=metadata_json.get("properties", {}).get("write.creator.id", None),
                compaction_enabled=metadata_json.get("properties", {}).get("write.compaction.enabled", "false").lower() == "true"
            )

            # Metadata Files
            metadata_path = metadata_json.get("metadata-location", "")
            if not metadata_path:
                metadata_path = f"{table_location}/metadata/metadata.json"

            if not metadata_path.startswith("s3://"):
                metadata_path = f"s3://{bucket}/{metadata_path}"

            manifest_lists = []
            for snap in metadata_json.get("snapshots", []):
                if "manifest-list" in snap and snap["manifest-list"]:
                    ml_path = snap["manifest-list"]
                    if not ml_path.startswith("s3://"):
                        ml_path = f"s3://{bucket}/{ml_path}"
                    manifest_lists.append(ml_path)

            metadata_files = MetaDataFiles(
                iceberg={
                    "metadata": [metadata_path],
                    "manifest_lists": manifest_lists,
                    "manifests": []  # To be implemented later!!
                }
            )

            # Unified Metadata
            unified_metadata = UnifiedMetaData(
                link=f"s3://{bucket}/{table_location}",
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
