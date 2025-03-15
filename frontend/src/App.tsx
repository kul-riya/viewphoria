import HomePage from "./pages/HomePage";
import DataInputPage from "./pages/DataInputPage";
import OnBoarding from "./pages/OnBoarding";
import { Route, Routes } from "react-router";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<OnBoarding />} />
      <Route path="/data_input" element={<DataInputPage />} />
      <Route path="/home" element={<HomePage />} />
      {/* More routes can be added with the similar syntax, i.e just duplicate the Route tag and provide path and element  */}
    </Routes>
    </>
  );
}

export default App;
