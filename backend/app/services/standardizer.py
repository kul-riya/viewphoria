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
            table_info = TableInfo(
                name=f"Parquet_File_{idx+1}",
                format="parquet",
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
                    total_files += snap["summary"].get("total-data-files", 0)
                    if "total-records" in snap["summary"]:
                        total_rows += snap["summary"]["total-records"]

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
