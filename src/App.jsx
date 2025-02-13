import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Protect/Route";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/User";
import Home from "./pages/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import ReportGenerate from "./pages/ReportGenerate";
import ViewReport from "./pages/ViewReport";
import EditReports from "./pages/EditReports";
import ListReports from "./pages/ListReports";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/users" element={<ProtectedRoute element={<UserList />} />} />
      <Route path="/generate" element={<ProtectedRoute element={<ReportGenerate />} />} />
      <Route path="/reports/:reportId" element={<ProtectedRoute element={<ViewReport />} />} />
      <Route path="/reports/list" element={<ProtectedRoute element={<ListReports />} />} />
      <Route path="/reports/edit/:reportId" element={<ProtectedRoute element={<EditReports />} />} />
    </Routes>
  );
}

export default App;