import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./dashboard.css";

const URL_USER=import.meta.env.VITE_API_URL_USER

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return navigate("/");
      }
      await axios.post(
        `${URL_USER}:3004/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Página principal</h1>
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;