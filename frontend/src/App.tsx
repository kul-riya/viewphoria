import Home from "./pages/Home";
import OnBoarding from "./pages/OnBoarding";
import { Route, Routes } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnBoarding />} />
      <Route path="/home" element={<Home />} />
      {/* More routes can be added with the similar syntax, i.e just duplicate the Route tag and provide path and element  */}
    </Routes>
  );
}

export default App;
