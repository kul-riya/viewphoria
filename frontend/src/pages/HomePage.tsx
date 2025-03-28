import React, { useState } from "react";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import PartitionMetadataViewer from "../components/layout/Metadata_Partition";
import MetadataOverviewTable from "../components/layout/MetadataOverviewTable";
import DataInputField from "../components/layout/DataInputField";
import Navbar from "../components/common/Navbar";
import SnapshotEvolutionTimeline from "../components/layout/SnapshotEvolutionTimeline";

const HomePage: React.FC = () => {
  const [fetch, setFetch] = useState(false);

  const handleFetch = () => {
    console.log(fetch);
    setFetch(true);
  };

  return (
    <>
      <Navbar />
      <div className="p-4 bg-slate-950 ">
      <div className="px-0.5 overflow-hidden min-h-screen flex flex-col items-center">
        <motion.div
          className="w-full flex justify-center"
          initial={{ y: 0 }} // Initially centered
          animate={{ y: fetch ? -100 : 0 }} // Move up when fetch is true
          transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition
        >
          <DataInputField onFetch={handleFetch} />
        </motion.div>

        {fetch && (
          <motion.div
            key="Display-After-Fetch"
            className="w-full"
            initial={{ opacity: 0, y: 20 }} // Start invisible & slightly lower
            animate={{ opacity: 1, y: 0 }} // Fade in & move up
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth transition
          >
            <MetadataOverviewTable />
            <PartitionMetadataViewer />
            <SnapshotEvolutionTimeline/>
          </motion.div>
        )}
      </div>
      </div>
    </>
  );
};

export default HomePage;
