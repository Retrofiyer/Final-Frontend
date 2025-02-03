import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Protect/Route";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
    </Routes>
  );
}

export default App;