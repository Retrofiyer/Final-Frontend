import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return navigate("/");
      }
      await axios.post(
        "http://localhost:3004/auth/logout",
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