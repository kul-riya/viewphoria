import DataInputField from "./pages/DataInputField";
import OnBoarding from "./pages/OnBoarding";
import { Route, Routes } from "react-router";
import MetadataOverviewTable from "./components/layout/MetadataOverviewTable";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<OnBoarding />} />
      <Route path="/data_input" element={<DataInputField />} />
      {/* <Route path="/home" element={<HomePage />} /> */}

      {/* More routes can be added with the similar syntax, i.e just duplicate the Route tag and provide path and element  */}
    </Routes>

    <MetadataOverviewTable/>
    </>
  );
}

export default App;
