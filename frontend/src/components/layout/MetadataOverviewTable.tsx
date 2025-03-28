import { Card, CardContent } from "../ui/card";

const tempData = {
  metadata: {
    link: "s3://csi-fries/iceberg_table",
    table: {
      name: "Iceberg_Table_1",
      location: "s3://csi-fries/iceberg_table",
      format: "iceberg",
      version: 1,
    },
    schema: {
      fields: [
        {
          name: "id",
          type: "int",
          required: true,
          min_value: null,
          max_value: null,
        },
        {
          name: "name",
          type: "string",
          required: true,
          min_value: null,
          max_value: null,
        },
        {
          name: "age",
          type: "int",
          required: true,
          min_value: null,
          max_value: null,
        },
        {
          name: "city",
          type: "string",
          required: true,
          min_value: null,
          max_value: null,
        },
      ],
      evolution_supported: true,
    },
    partitioning: {
      type: "transform",
      columns: [],
    },
    snapshots: [],
    files: [
      {
        file_path: "this is a path",
        format: "parquet",
        size_bytes: 123,
        row_count: 432,
      },
      {
        file_path: "this is a path",
        format: "parquet",
        size_bytes: 321,
        row_count: 2,
      },
    ],
    metadata_files: {
      iceberg: {
        metadata: ["s3://csi-fries/iceberg_table/metadata/metadata.json"],
        manifest_lists: [],
        manifests: [],
      },
      delta_log: null,
      hudi_timeline: null,
    },
    properties: {
      write_format_default: "parquet",
      compression: "SNAPPY",
      created_by: null,
      compaction_enabled: false,
    },
  },
  status: 200,
  server_timestamp: "2025-03-26T12:24:59.357596",
};

export default function MetadataOverviewTable() {
  const columns = tempData.metadata.schema.fields;
  const files = tempData.metadata.files;

  let totalRows = 0;
  let totalSize = 0;

  if (files.length != 0) {
    files.map((file) => {
      totalRows += file.row_count;
      totalSize += file.size_bytes;
    });
  }

  // Helper function to format file size
  const formatFileSize = (bytes: any) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className = "p-2">
    <Card className="bg-[#321147]/50 backdrop-blur-sm mb-12 text-white w-full mx-auto max-w-3xl rounded-2xl">
      <CardContent className="p-6 w-full">
        {/* Summary Statistics */}
        <div className="w-full grid grid-cols-3 gap-4 text-center mb-4">
          {[
            { label: "File Count", value: files.length },
            { label: "Row Count", value: totalRows },
            { label: "Total Size", value: formatFileSize(totalSize) },
          ].map((stat, index) => (
            <div key={index} className="p-2 flex-col justify-between">
              <p className="w-full flex justify-around text-center text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {stat.value}
              </p>
              <p className="w-full flex justify-around text-center text-sm text-purple-200">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Metadata Table */}
        <div className="bg-transparent font-semibold p-4 text-purple-100 tracking-wider">
          <div className="grid grid-cols-3 text-sm mt-2 rounded-t-xl hover:bg-purple-900/30 transition-colors duration-200 text-center">
            {["Column Name", "Data Type", "Max | Min Value"].map(
              (header, index) => (
                <p
                  key={index}
                  className="font-semibold p-4 text-lg text-purple-100 tracking-wider"
                >
                  {header}
                </p>
              )
            )}
          </div>

          {/* Table Rows */}
          {columns.map((col, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 text-sm border-b border-white/28 py-3
                ${index % 2 === 0 ? "bg-transparent" : "bg-transparent"}
                hover:bg-purple-900/30 transition-colors duration-200`}
            >
              <p className="px-4 text-purple-100 text-center uppercase">
                {col.name}
              </p>
              <p className="px-4 text-purple-200 text-center">{col.type}</p>
              <p className="px-4 text-purple-300 text-center">
                {col.max_value || "NA"} | {col.min_value || "NA"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

