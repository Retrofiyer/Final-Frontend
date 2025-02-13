import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Table, Alert, Spinner } from "react-bootstrap";
import { FaSave, FaEdit, FaTrash, FaFileExport } from "react-icons/fa";
import ExportReportModal from "../ReportModal/ExportReportModal";
import axios from "axios";

const URL_USER = import.meta.env.VITE_API_URL_USER;
const URL_REPORT = import.meta.env.VITE_API_URL_REPORTS;
const URL_REPORT1 = import.meta.env.VITE_API_URL_REPORTS1;

const ViewReports = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const { reportId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchReport = async () => {
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
          `${URL_REPORT}:3024/reports/${reportId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReport(response.data);
      } catch (err) {
        setError("Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, token]);

  const handleSave = async () => {
    try {
      const authResponse = await axios.post(
        `${URL_USER}:3001/auth/authorize`,
        { action: "create" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!authResponse.data.authorized) {
        setError("You do not have permission to view reports.");
        return;
      }

      const response = await axios.post(
        `${URL_REPORT}:3021/reports/save/${reportId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Report saved successfully!");
      navigate("/generate");
    } catch (error) {
      alert("❌ Error saving report");
      console.error("Save report error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("⚠ Are you sure you want to delete this report?");
      if (!confirmDelete) return;

      const authResponse = await axios.post(
        `${URL_USER}:3001/auth/authorize`,
        { action: "delete" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!authResponse.data.authorized) {
        setError("You do not have permission to delete reports.");
        return;
      }

      await axios.delete(`${URL_REPORT1}:3025/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Report deleted successfully!");
      navigate("/generate");
    } catch (error) {
      alert("❌ Error deleting report.");
      console.error("Delete report error:", error);
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
    <Container className="mt-4">
      <h2 className="text-center">Report Details</h2>
      <Table striped bordered hover responsive>
        <tbody>
          <tr>
            <th>Event Name</th>
            <td>{report.event_name}</td>
          </tr>
          <tr>
            <th>Manager</th>
            <td>{report.event_manager_name}</td>
          </tr>
          <tr>
            <th>People Attended</th>
            <td>{report.number_people}</td>
          </tr>
          <tr>
            <th>Volunteers</th>
            <td>{report.number_volunteers}</td>
          </tr>
          <tr>
            <th>Patients Attended</th>
            <td>{report.patients_attended}</td>
          </tr>
          <tr>
            <th>Name Patients</th>
            <td>{report.patients_name}</td>
          </tr>
          <tr>
            <th>Medication Used</th>
            <td>{report.medication_used ? "Yes" : "No"}</td>
          </tr>
          {report.medication_used && (
            <>
              <tr>
                <th>Medication Quantity</th>
                <td>{report.quantity_medications}</td>
              </tr>
              <tr>
                <th>Medications</th>
                <td>{report.medications_name.join(", ")}</td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center gap-3 mt-3">
        <Button variant="success" onClick={handleSave}>
          <FaSave /> Save
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/reports/edit/${reportId}`)}
        >
          <FaEdit /> Edit
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          <FaTrash /> Delete
        </Button>
        <Button variant="info" onClick={() => setShowExportModal(true)}>
          <FaFileExport /> Export
        </Button>
        <ExportReportModal
        reportId={reportId}
        show={showExportModal}
        handleClose={() => setShowExportModal(false)}
      />
      </div>
    </Container>
  );
};

export default ViewReports;
