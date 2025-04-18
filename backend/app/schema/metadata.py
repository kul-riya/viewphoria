from typing import List, Optional, Dict, Union
from pydantic import BaseModel
import datetime


# Attribute-1 Table Information
class DataInfo(BaseModel):
    name: str # file name
    location: Optional[str] = None # path
    format: str
    version: Optional[Union[int, str]] = None

# Attribute-2 Schema Information
class SchemaField(BaseModel):
    name: str
    type: str
    required: Optional[bool] = False
    min_value: Optional[Union[int, float, str, datetime.date]] = None
    max_value: Optional[Union[int, float, str, datetime.date]] = None


class TableSchema(BaseModel):
    fields: List[SchemaField]
    evolution_supported: Optional[bool] = True


# Attribute-7 Multiple Metadata File Links for (Iceberg, Delta, and Hudi)

class SnapshotMeta(BaseModel):
    snapshot_id: str
    timestamp: int
    operation: str  # Append, overwrite, etc.
    added_files: Optional[int] = 0
    total_size_bytes: Optional[int] = 0
    total_records: Optional[int] = 0
    changed_partition_count: Optional[int] = 0
    deleted_files: Optional[int] = 0
    modified_files: Optional[int] = 0




# Attribute-3 Partitioning
class PartitionColumn(BaseModel):
    field_id: Optional[Union[int, str]] = None
    name: Optional[Union[str]] # Vendor id
    value: List[Optional[Union[int, float, str,datetime.datetime]]] =[] # Vendor id ka value
    file_paths: List[Optional[str]] = [] # file paths of all files in the particular Partition Column
    type: str



class Partitioning(BaseModel):
    type: Optional[str] = None  # Example: "hash", "list", "range"
    columns: List[PartitionColumn] = []



# Attribute-4 Individual file snapshot
class SnapshotFile(BaseModel):
    path: str
    operation: str  # Append, overwrite, etc.
    added_records: Optional[int] = 0
    deleted_records: Optional[int] = 0
    modified_records: Optional[int] = 0

# Attribute-5 Row group, added a new class to represent grouping at file level
class RowGroup(BaseModel):
    row_count: int
    size_bytes: int
    min_values: Optional[Dict[str, Union[int, float, str]]] = None
    max_values: Optional[Dict[str, Union[int, float, str]]] = None
    null_counts: Optional[Dict[str, int]] = None

# Attribute-6 File Meta Data
# if needs to be implemented for iceberg in future, parquet wll have to be parsed
class FileMetaData(BaseModel):
    file_path: str
    format: str
    size_bytes: Union[int, float]
    row_count: Optional[int] = None
    row_groups: Optional[List[RowGroup]] = [] # only for hudi and parquet data type
    schema: Optional[TableSchema] = None
    partition: Partitioning = None # only for iceberg
    snapshot: Optional[List[SnapshotFile]] = [] # only for hudi, iceberg


# Attribute-8 Table Properties
class TableProperties(BaseModel):
    write_format_default: Optional[str] = "parquet"
    compression: Optional[str] = "MIN"
    created_by: Optional[str] = None
    compaction_enabled: Optional[bool] = False

# Unified Metadata Model

class UnifiedMetaData(BaseModel):
    link: str
    info: Optional[DataInfo] = None
    schema: Optional[TableSchema] = None
    partitioning: Optional[Partitioning] = None
    snapshot_timeline: Optional[List[SnapshotMeta]] = []
    files: Optional[List[FileMetaData]] = []
    properties: Optional[TableProperties] = None