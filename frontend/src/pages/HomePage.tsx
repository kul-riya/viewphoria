import React, { useState } from "react";
import { motion } from "framer-motion";
import PartitionMetadataViewer from "../components/layout/Metadata_Partition";
import MetadataOverviewTable from "../components/layout/MetadataOverviewTable";
import DataInputField from "../components/layout/DataInputField";
import Navbar from "../components/common/Navbar";
import AppSidebar from "../components/layout/AppSidebar";

const HomePage: React.FC = () => {
  const [fetch, setFetch] = useState(false);
  
  const handleFetch = () => {
    console.log(fetch);
    setFetch(true);
  };

  return (
    <div className="flex">
      <div className="w-64 fixed left-0 top-0 bottom-0 z-50">
        <AppSidebar />
      </div>
    </div>
  );
};

export default HomePage;