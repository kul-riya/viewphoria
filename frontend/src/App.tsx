import HomePage from "./pages/HomePage";
import OnBoarding from "./pages/OnBoarding";
import { Route, Routes } from "react-router";
import Temp from "./pages/Temp";
import Protected from "./pages/Protected";
import useAuthContext from "./hooks/useAuthContext";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<OnBoarding />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* Temporary Routes to check out auth */}
        <Route path="/temp" element={<Temp />} />
        <Route
          path="/protected"
        />
        {/* More routes can be added with the similar syntax, i.e just duplicate the Route tag and provide path and element  */}
      </Routes>
    </>
  );
}

export default App;
