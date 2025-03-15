import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BadgeInfo, FileText, Maximize2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import SummaryCard from "./Summary_Card";

const TreeConnector = () => {
  return (
    <div className="relative lg:block hidden">
      {/* Vertical line from parent */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-12 w-[2px] bg-white "></div>

      {/* Horizontal line across all children */}
      <div className="absolute left-0 right-0 h-[2px] bg-white top-12"></div>

      {/* Vertical lines to each child */}
      <div className="absolute left-1/8 transform -translate-x-1/2 top-12 h-12 w-[2px] bg-white"></div>
      <div className="absolute left-3/8 transform -translate-x-1/2 top-12 h-12 w-[2px] bg-white"></div>
      <div className="absolute left-5/8 transform -translate-x-1/2 top-12 h-12 w-[2px] bg-white"></div>
      <div className="absolute left-7/8 transform -translate-x-1/2 top-12 h-12 w-[2px] bg-white"></div>
    </div>
  );
};

const PartitionMetadataViewer = () => {
  const partitionsData = {
    numberOfPartitions: 4,
    partitionSpec: "year/month/day",
    largestPartition: "2023_12_31",
    smallestPartition: "2022_01_01",
    partitions: [
      {
        key: "2023_12_31",
        size: "245 MB",
        location: "s3://my-bucket/data/year=2023/month=12/day=31",
        files: 56,
        minValues: { timestamp: "2023-12-31T00:00:00", id: 1000 },
        maxValues: { timestamp: "2023-12-31T23:59:59", id: 2500 },
      },
      {
        key: "2023/12/30",
        size: "189 MB",
        location: "s3://my-bucket/data/year=2023/month=12/day=30",
        files: 42,
        minValues: { timestamp: "2023-12-30T00:00:00", id: 800 },
        maxValues: { timestamp: "2023-12-30T23:59:59", id: 1950 },
      },
      {
        key: "2023/12/29",
        size: "210 MB",
        location: "s3://my-bucket/data/year=2023/month=12/day=29",
        files: 48,
        minValues: { timestamp: "2023-12-29T00:00:00", id: 750 },
        maxValues: { timestamp: "2023-12-29T23:59:59", id: 1800 },
      },
      {
        key: "2023/12/28",
        size: "175 MB",
        location: "s3://my-bucket/data/year=2023/month=12/day=28",
        files: 38,
        minValues: { timestamp: "2023-12-28T00:00:00", id: 500 },
        maxValues: { timestamp: "2023-12-28T23:59:59", id: 1500 },
      },
    ],
  };

  const [summaryState, setSummaryState] = useState({
    partitionSpec: partitionsData.partitionSpec,
    largestPartition: partitionsData.largestPartition,
    smallestPartition: partitionsData.smallestPartition,
    numberPartitions: partitionsData.numberOfPartitions,
    partitionKey: undefined,
    partitionName: "",
    location: undefined,
  });

  const handleCardClick = (partition : any, name : string) => {
    setSummaryState({
      ...summaryState,
      partitionKey: partition.key,
      partitionName: name,
      largestPartition: partition.size,
      location: partition.location,
    });
  };

  return (
    <div className="min-h-screen text-white p-6 ">
      <div className="max-w-6xl mx-auto ">
        {/* Summary Card */}
        <SummaryCard partitionData={summaryState} />

        <TreeConnector />

        {/* Partition Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {partitionsData.partitions.map((partition, index) => (
            <Card
              key={index}
              className="bg-gray-800 text-white shadow-md lg:mt-24 hover:shadow-amber-100 hover:shadow-md hover:ring-2"
              onClick={() => handleCardClick(partition, `partition ${index}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <BadgeInfo size={16} />
                  Partition Key
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-sm font-normal text-white"
                >
                  {partition.key}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div>
                  <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                    <Maximize2 size={14} />
                    Size
                  </div>
                  <div className="text-sm">{partition.size}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                    <FileText size={14} />
                    Files
                  </div>
                  <div className="text-sm">{partition.files}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Min/Max Values
                  </div>
                  <div className="text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        Cost : {partition.minValues.id} -{" "}
                        {partition.maxValues.id}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartitionMetadataViewer;
