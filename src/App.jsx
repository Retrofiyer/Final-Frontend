import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Protect/Route";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/User";
import Home from "./pages/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import ReportGenerate from "./pages/ReportGenerate";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/users" element={<ProtectedRoute element={<UserList />} />} />
      <Route path="/generate" element={<ProtectedRoute element={<ReportGenerate />} />} />
    </Routes>
  );
}

export default App;