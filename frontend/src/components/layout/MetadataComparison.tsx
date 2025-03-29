import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import axios from "axios";

const SchemaComparison = () => {
  const [snapshot, setSnapshot] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null); // Add error state
  const [snapshot1, setSnapshot1] = useState("");
  const [snapshot2, setSnapshot2] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/metadata/snapshot/67e75e57fab735fceae2f8bd`
        );
        console.log("Fetched data:", response.data.data);
        setSnapshot(response.data.data || []); // Default to empty array if no data
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load snapshot data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateSnapshot = (snapshotId) => {
    for (let i = 0; i < snapshot.length; i++) {
      if (snapshot[i].snapshot_id === snapshotId) {
        return snapshot[i];
      }
    }
    return "";
  };

  const handleSnapshot1Change = (value) => {
    const selectedSnapshot = updateSnapshot(value);
    setSnapshot1(selectedSnapshot);
  };

  const handleSnapshot2Change = (value) => {
    const selectedSnapshot = updateSnapshot(value);
    setSnapshot2(selectedSnapshot);
  };

  const fields = [
    "Snapshot ID",
    "Timestamp",
    "Operation",
    "Added Files",
    "Total Size (in bytes)",
    "Total Records",
    "Changed Partition count",
    "Deleted Files",
    "Modified Files",
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-6 text-white text-center">
        Loading snapshot data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#1A0E2E]/70 rounded-lg max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-white text-xl md:text-2xl font-semibold">
          Comparison
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="space-y-2 w-full sm:w-auto">
            <Label htmlFor="snapshot1" className="text-white">
              Snapshot 1
            </Label>
            <Select onValueChange={(value) => handleSnapshot1Change(value)}>
              <SelectTrigger
                id="snapshot1"
                className="w-full sm:w-48 bg-[#1E2A3A] text-white border-[#3A3E52]"
              >
                <SelectValue placeholder="Select ID" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E2A3A] text-white border-[#3A3E52]">
                {snapshot.map((item) => (
                  <SelectItem key={item.snapshot_id} value={item.snapshot_id}>
                    id: {item.snapshot_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full sm:w-auto">
            <Label htmlFor="snapshot2" className="text-white">
              Snapshot 2
            </Label>
            <Select onValueChange={(value) => handleSnapshot2Change(value)}>
              <SelectTrigger
                id="snapshot2"
                className="w-full sm:w-48 bg-[#1E2A3A] text-white border-[#3A3E52]"
              >
                <SelectValue placeholder="Select ID" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E2A3A] text-white border-[#3A3E52]">
                {snapshot.map((item) => (
                  <SelectItem key={item.snapshot_id} value={item.snapshot_id}>
                    id: {item.snapshot_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Card className="border border-[#3A3E52] rounded-lg overflow-hidden min-w-full bg-[#1E2A3A]">
          <CardContent className="p-0">
            <div className="grid grid-cols-3 w-full">
              <div className="p-3 md:p-4 font-medium text-white border-b border-r border-[#3A3E52] text-sm md:text-base">
                Field name
              </div>
              <div className="p-3 md:p-4 font-medium text-center text-white border-b border-r border-[#3A3E52] text-sm md:text-base">
                Snapshot 1
              </div>
              <div className="p-3 md:p-4 font-medium text-center text-white border-b border-[#3A3E52] text-sm md:text-base">
                Snapshot 2
              </div>

              {fields.map((field, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`p-3 md:p-4 font-medium text-white border-r border-[#3A3E52] ${
                      index % 2 === 0 ? "bg-[#1E2A3A]" : "bg-[#202640]"
                    } text-sm md:text-base`}
                  >
                    {field}
                  </div>
                  <div
                    className={`p-3 md:p-4 border-r border-[#3A3E52] text-white ${
                      index % 2 === 0 ? "bg-[#1E2A3A]" : "bg-[#202640]"
                    } text-sm md:text-base`}
                  >
                    {snapshot1[field] || "-"}
                  </div>
                  <div
                    className={`p-3 md:p-4 text-white ${
                      index % 2 === 0 ? "bg-[#1E2A3A]" : "bg-[#202640]"
                    } text-sm md:text-base`}
                  >
                    {snapshot2[field] || "-"}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchemaComparison;