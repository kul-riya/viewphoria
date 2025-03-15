import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/common/navbar";
import MetadataOverviewTable from "./components/layout/MetadataOverviewTable";
import OnBoarding from "./pages/OnBoarding";
import DataInputField from "./components/layout/DataInputField";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/credential-management"
          element={<CredentialManagement />}
        />
        <Route
          path="/advanced-data-discovery"
          element={<AdvancedDataDiscovery />}
        />
        <Route path="/" element={<OnBoarding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Placeholder routes
// change home

function CredentialManagement() {
  return <div className="p-4">Credential Management Page</div>;
}

function AdvancedDataDiscovery() {
  return <div className="p-4">Advanced Data Discovery Page</div>;
}
