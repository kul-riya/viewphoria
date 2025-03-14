import { Card, CardContent } from "../ui/card";

type partitionData = {
  numberPartitions: number;
  partitionSpec: string;
  largestPartition: string;
  smallestPartition: string;
};

type Props = {
  partitionData: partitionData;
};

const SummaryCard = (props: Props) => {
  return (
    <Card className="w-full bg-blue-600 text-white shadow-lg relative overflow-hidden lg:mb-0 mb-8">
      <CardContent className="pt-6 flex justify-between items-center">
        <div className="space-y-2">
          <div className="text-white/80">Partition spec</div>
          <div className="font-medium">{props.partitionData.partitionSpec}</div>
          <div className="text-white/80">Largest Partition</div>
          <div className="font-medium">
            {props.partitionData.largestPartition}
          </div>
          <div className="text-white/80">Smallest Partition</div>
          <div className="font-medium">
            {props.partitionData.smallestPartition}
          </div>
        </div>
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <div className="text-xl font-bold text-center">
              <p className="text-lg">Total Partitions</p>
              {props.partitionData.numberPartitions}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
