// import React from "react";
// import PartitionMetadataViewer from "../components/layout/Metadata_Partition";
// import MetadataOverviewTable from "../components/layout/MetadataOverviewTable";
// import DataInputField from "../components/layout/DataInputField";
// import { useState } from "react";

// const HomePage: React.FC = () => {
//   const [fetch, setFetch] = useState(false);

//   const handleFetch = () => {
//     console.log(fetch)
//     setFetch(true);
//   };

//   return (
// <div className="bg-gray-900 px-0.5 overflow-hidden min-h-screen flex flex-col items-center justify-center">
// {/* Need to import Navbar here */}
//       {/* Need to import file/service provider input here */}
//       {/* <Navbar/> */}

//       {/* <div
//         className={`w-full flex flex-col items-center transition-all duration-500 ${
//           fetch ? "mt-0" : "flex-grow justify-center"
//         }`}
//       >
//         <DataInputField onFetch={handleFetch} />
//       </div> */}

//   <div
//         className={`w-full flex flex-col items-center transition-all duration-500 ${
//           fetch ? "mt-0" : "flex-grow justify-center"
//         }`}
//       >
//         <DataInputField onFetch={handleFetch} />
//       </div>

//       {/* <DataInputField onFetch = {handleFetch}/> */}

//       {fetch &&
//       <div key="Display-After-Fetch" className="">
//       <MetadataOverviewTable/>
//       <PartitionMetadataViewer />
//     </div>
//     }

//     </div>
//   );
// };

// export default HomePage;

import React, { useState } from "react";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import PartitionMetadataViewer from "../components/layout/Metadata_Partition";
import MetadataOverviewTable from "../components/layout/MetadataOverviewTable";
import DataInputField from "../components/layout/DataInputField";

const HomePage: React.FC = () => {
  const [fetch, setFetch] = useState(false);

  const handleFetch = () => {
    console.log(fetch);
    setFetch(true);
  };

  return (
    <div className="bg-slate-950 px-0.5 overflow-hidden min-h-screen flex flex-col items-center">
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
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
