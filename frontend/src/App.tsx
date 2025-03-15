import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/common/navbar";

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
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Placeholder routes
// change home
function Home() {
  return <div className="p-4">Home Page</div>;
}

function CredentialManagement() {
  return <div className="p-4">Credential Management Page</div>;
}

function AdvancedDataDiscovery() {
  return <div className="p-4">Advanced Data Discovery Page</div>;
}
