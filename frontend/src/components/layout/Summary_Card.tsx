import { Card, CardContent } from "../ui/card";

type partitionData = {
  numberPartitions: number;
  partitionSpec?: string;
  largestPartition?: string;
  smallestPartition?: string;
  partitionKey?: string;
  partitionName?: string;
  location?: string;
};

type Props = {
  partitionData: partitionData;
};

const SummaryCard = (props: Props) => {
  return (
    <Card className="w-full bg-linear-to-t from-sky-500 to-indigo-500 text-white shadow-lg relative overflow-hidden lg:mb-0 mb-8 opacity-90">
      {props.partitionData.partitionKey ? (
        <h1 className="text-center text-2xl font-bold">Partition Details</h1>
      ) : (
        <h1 className="text-center text-2xl font-bold">
          All Partitions Overview
        </h1>
      )}
      <CardContent className="pt-2 flex justify-between items-center">
        {!props.partitionData?.partitionKey ? (
          <>
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">
                Last Modified - 12th March, 2025
              </div>
              <div className="text-white text-lg font-semibold">
                Largest Partition - {props.partitionData.largestPartition}
              </div>
              <div className="text-white text-lg font-semibold">
                Smallest Partition - {props.partitionData.smallestPartition}
              </div>
              <div className="text-white text-lg font-semibold">
                Max No. of Files in Single Partition - 56
              </div>
            </div>
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 lg:block hidden">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <div className="text-xl font-bold text-center">
                  <p className="text-lg">Total Partitions</p>
                  {props.partitionData.numberPartitions}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="text-white text-lg font-semibold">
                Partition Name - {props.partitionData.partitionName}
              </div>
              <div className="font-semibold text-lg">
                Partition Key - {props.partitionData.partitionKey}
              </div>
              <div className="font-semibold text-lg">
                Partition Size - {props.partitionData.largestPartition}
              </div>
              <div className="font-semibold text-lg">
                Number of Columns - {Math.ceil(Math.random() * 100 + 10)}
              </div>
              <div className="font-semibold text-lg">
                Partition location - {props.partitionData.location}
              </div>
            </div>
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 lg:block hidden">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <div className="text-xl font-bold text-center">
                  <p className="text-lg">Total Partitions</p>
                  {props.partitionData.numberPartitions}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
