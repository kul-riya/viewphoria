from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column,relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import String,Enum
import enum

class Base(DeclarativeBase):
    pass

class FileType(enum.Enum):
    iceberg = "iceberg"
    parquet = "parquet"
    hudi = "hudi"
    delta = "delta"


class Metadata(Base):
    __tablename__="Metadata"
    id:Mapped[str] = mapped_column(String(100),primary_key=True)
    file_type:Mapped["FileType"] = mapped_column(Enum(FileType),nullable=True)
    object_id_aws:Mapped[str] = mapped_column(String(100),nullable=True)
    meta_data:Mapped[dict] = mapped_column(JSONB,nullable=True)
    Bucket_name:Mapped[str] = mapped_column(String(100),nullable=True)

    def print_metadata(self):
        print(self.metadata)
