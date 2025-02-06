import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Protect/Route";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import Home from "./pages/Home";

import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/users" element={<ProtectedRoute element={<UserList />} />} />
    </Routes>
  );
}

export default App;