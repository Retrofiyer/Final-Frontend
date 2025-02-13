import { Container, Spinner, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSort, FaEye } from "react-icons/fa";
import "./ListReport.css";
import axios from "axios";

const URL_USER = import.meta.env.VITE_API_URL_USER;
const URL_REPORT = import.meta.env.VITE_API_URL_REPORTS;
const URL_REPORT1 = import.meta.env.VITE_API_URL_REPORTS1;

const ListReport = () => {
  const [reports, setReports] = useState([]);
  const [orderByDate, setOrderByDate] = useState("desc");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

  const fetchReports = async () => {
    try {
      const authResponse = await axios.post(
        `${URL_USER}:3001/auth/authorize`,
        { action: "view" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!authResponse.data.authorized) {
        setError("You do not have permission to view reports.");
        return;
      }

      const response = await axios.get(
        `${URL_REPORT1}:3023/reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReports(response.data);
    } catch (error) {
      setError(`Error fetching reports: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  fetchReports();
  }, [orderByDate]);

  const handleViewReport = async (reportId) => {
    try {
      const response = await axios.get(
        `${URL_REPORT}:3024/reports/${reportId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Report data:", response.data);
      navigate(`/reports/${reportId}`);
    } catch (error) {
      console.error("Error fetching report details:", error);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading report...</p>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Reports List</h2>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setOrderByDate(orderByDate === "asc" ? "desc" : "asc")}
        >
          Sort by date <FaSort />
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Date of Creation</th>
              <th>Report ID</th>
              <th>Event Name</th>
              <th>Administrator</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                No reports available
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.created_at}</td>
                  <td>{report.id}</td>
                  <td>{report.event_name}</td>
                  <td>{report.event_manager_name}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListReport;