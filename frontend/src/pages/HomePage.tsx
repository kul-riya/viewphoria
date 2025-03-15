import React from "react";
import PartitionMetadataViewer from "../components/layout/Metadata_Partition";
import MetadataOverviewTable from "../components/layout/MetadataOverviewTable";

const HomePage: React.FC = () => {
  return (
    <div className= "bg-gray-900">
      {/* Need to import Navbar here */}
      {/* Need to import file/service provider input here */}
      {/* <Navbar/> */}
      {/* <URIFileInput/> */}
      <MetadataOverviewTable/>
      <PartitionMetadataViewer />
    </div>
  );
};

export default HomePage;
