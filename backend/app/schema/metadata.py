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

class TableSchema(BaseModel):
    fields: List[SchemaField]
    evolution_supported: Optional[bool] = True

# Attribute-3 Partitioning
class Partitioning(BaseModel):
    strategy: Optional[str] = None # Hash, List, Range can be anything...
    columns: List[str] = []

# Attribute-4 Snapshot
class Snapshot(BaseModel):
    snapshot_id: str
    timestamp: str
    operation: str  # This shows what operation was done pertaining to a commit, eg: append, overwrite etc.
    added_files: Optional[int] = 0
    manifest_list: Optional[str] = None

# Attribute-5 File Level Data
class FileMetaData(BaseModel):
    file_path: str
    format: str
    size_bytes: str
    row_count: Optional[int] = None
    min_values: Optional[int] = None
    max_values: Optional[int] = None
    null_counts: Optional[Dict[str, int]] = None

# Attribute-6 Multiple Metadata File Links for (Iceberg, Delta and Hudi)
class MetaDataFiles(BaseModel):
    iceberg: Optional[Dict[str, List[str]]] = None
    delta_log: Optional[List[str]] = None
    hudi_timeline: Optional[List[str]] = None

# Attribute-7 Contains some misc properties...
class TableProperties(BaseModel):
    write_format_default: Optional[str] = "parquet" # By default, file extension is chosen to be parquet
    compression: Optional[str] = "MIN"
    created_by: Optional[str] = None
    compaction_enabled: Optional[bool] = False

# Attribute-8 Indexing Property
class Indexing(BaseModel):
    bloom_filter: Optional[Dict[str, Union[str]]] = None

## MAIN UNIFIED METADATA MODEL
class UnifiedMetaData(BaseModel):
    table: TableInfo
    schema: TableSchema
    partitioning: Optional[Partitioning] = None
    snapshots: Optional[List[Snapshot]] = []
    files: Optional[List[FileMetaData]] = []
    metadata_files: Optional[MetaDataFiles] = None
    properties: Optional[TableProperties] = None
    indexing: Optional[Indexing] = None



