import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { FaCircle } from "react-icons/fa";
import { useState } from "react";


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
    snapshots: [
      {
        "snapshot_id" : "287364982",
        "timestamp" : 23897423123,
        "operation" : "Append",
        "added_files" : 12904,
        "total_size_bytes": 23984,
        "changed_prtition_count" : 435,
        "deleted_files" : 3,
        "modified_files" : 2
      },
      {
        "snapshot_id" : "287364982",
        "timestamp" : 23897423123,
        "operation" : "Append",
        "added_files" : 12904,
        "total_size_bytes": 23984,
        "changed_prtition_count" : 435,
        "deleted_files" : 3,
        "modified_files" : 2
      },
      {
        "snapshot_id" : "287364982",
        "timestamp" : 23897423123,
        "operation" : "Append",
        "added_files" : 12904,
        "total_size_bytes": 23984,
        "changed_prtition_count" : 435,
        "deleted_files" : 3,
        "modified_files" : 2
      },
      {
        "snapshot_id" : "287364982",
        "timestamp" : 23897423123,
        "operation" : "Append",
        "added_files" : 12904,
        "total_size_bytes": 23984,
        "changed_prtition_count" : 435,
        "deleted_files" : 3,
        "modified_files" : 2
      }
      
    ],
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


const SnapshotEvolutionTimeline = () => {
  return (
    <div className="px-20 h-fit">
      <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-center">
        Snapshot Timeline
      </h1>

      <div className="w-full md:hidden">
        <div className="relative pl-8">
          <div className="absolute left-7.5 top-0 bottom-0 w-1 bg-gray-300"></div>

          {tempData.metadata.snapshots.map((snapshot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative mb-8 last:mb-0"
            >
              <div className="absolute left-0 top-1/2 w-8 h-8 -ml-4 -translate-y-1/2 bg-purple-500 rounded-full flex items-center justify-center shadow-lg z-10">
                <FaCircle className="text-white text-xs" />
              </div>

              <div className="ml-8">
                <Card className="w-full shadow-lg bg-white">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{snapshot.snapshot_id}</h3>
                    <p className="text-gray-600 text-sm">{snapshot.timestamp}</p>
                    <p className="mt-2 text-gray-700 text-sm">
                      Files added : {snapshot.added_files}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Horizontal for larger screens */}
      <div className="w-full overflow-x-auto overflow-y-visible h-124 hidden md:block">
        <div className="relative min-w-max hidden md:block h-fit">
          {/* Horizontal line should extend over all events */}
          <div className="absolute left-0 right-0 bottom-5 h-1 bg-gray-300 -translate-y-1/2 w-full "></div>

          <div className="h-fit flex justify-between w-max">
            {tempData.metadata.snapshots.map((snapshot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center relative p-2"
              >
                {/* Card - positioned above/below the line */}
                <div
                  className={`relative ${
                    index % 2 === 0 ? "bottom-2" : "top-62"
                  }`}
                >
                  <Card className="shadow-lg bg-white w-60 ">
                    <CardContent className="h-40">
                      <h3 className="text-lg font-semibold">ID : {snapshot.snapshot_id}</h3>
                      <p className="text-gray-600 text-sm">TimeStamp: {snapshot.timestamp}</p>
                      <p className="mt-2 text-gray-700 text-sm">
                        Added Files: {snapshot.added_files}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Dot - on the line */}
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg z-10">
                  <FaCircle className="text-white text-xs" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapshotEvolutionTimeline;
