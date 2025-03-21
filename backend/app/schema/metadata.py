from typing import List, Optional, Dict, Union
from pydantic import BaseModel
import datetime
# Attribute-1 Table Information
class TableInfo(BaseModel):
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
    min_values: Optional[Dict[str, Union[int, float, str, datetime.date]]] = None
    max_values: Optional[Dict[str, Union[int, float, str, datetime.date]]] = None