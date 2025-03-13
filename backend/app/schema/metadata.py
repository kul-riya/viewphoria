from typing import List, Optional, Dict, Union
from pydantic import BaseModel

# Attribute-1 Table Information
class TableInfo(BaseModel):
    name: str
    location: str
    format: str
    version: Optional[int] = None

# Attribute-2 Schema Information
class SchemaField(BaseModel):
    name: str
    type: str
    required: Optional[bool] = False
    min_value: Optional[Union[int, float, str]] = None
    max_value: Optional[Union[int, float, str]] = None

class TableSchema(BaseModel):
    fields: List[SchemaField]
    evolution_supported: Optional[bool] = True

# Attribute-3 Partitioning
class PartitionColumn(BaseModel):
    name: str
    type: str

class Partitioning(BaseModel):
    type: Optional[str] = None  # Example: "hash", "list", "range"
    columns: List[PartitionColumn] = []

# Attribute-4 Snapshot
class Snapshot(BaseModel):
    snapshot_id: str
    timestamp: str
    operation: str  # Append, overwrite, etc.
    added_files: Optional[int] = 0
    deleted_files: Optional[int] = 0
    modified_files: Optional[int] = 0
    manifest_list: Optional[str] = None

# Attribute-5 Row group, added a new class to represent grouping at file level
class RowGroup(BaseModel):
    row_count: int
    size_bytes: int
    min_values: Optional[Dict[str, Union[int, float, str]]] = None
    max_values: Optional[Dict[str, Union[int, float, str]]] = None
    null_counts: Optional[Dict[str, int]] = None

# Attribute-6 File Meta Data
class FileMetaData(BaseModel):
    file_path: str
    format: str
    size_bytes: str
    row_count: Optional[int] = None
    row_groups: Optional[List[RowGroup]] = []

# Attribute-6 Multiple Metadata File Links for (Iceberg, Delta, and Hudi)
class MetaDataFiles(BaseModel):
    iceberg: Optional[Dict[str, List[str]]] = None
    delta_log: Optional[List[str]] = None
    hudi_timeline: Optional[List[str]] = None

# Attribute-7 Table Properties
class TableProperties(BaseModel):
    write_format_default: Optional[str] = "parquet"
    compression: Optional[str] = "MIN"
    created_by: Optional[str] = None
    compaction_enabled: Optional[bool] = False

# Unified Metadata Model
class UnifiedMetaData(BaseModel):
    link: str
    table: TableInfo
    schema: TableSchema
    partitioning: Optional[Partitioning] = None
    snapshots: Optional[List[Snapshot]] = []
    files: Optional[List[FileMetaData]] = []
    metadata_files: Optional[MetaDataFiles] = None
    properties: Optional[TableProperties] = None
