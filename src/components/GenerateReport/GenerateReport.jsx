import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { FaSave } from "react-icons/fa";

const URL_REPORT = import.meta.env.VITE_API_URL_REPORTS;
const URL_USER = import.meta.env.VITE_API_URL_USER;

const GenerateReport = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState({
    event_name: "",
    event_manager_name: "",
    number_people: "",
    number_volunteers: "",
    patients_attended: "",
    patients_name: "",
    medication_used: false,
    quantity_medications: "",
    medications_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setReportData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name.includes("number") ||
            name === "patients_attended" ||
            name === "quantity_medications"
          ? value === ""
            ? null
            : parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    const sanitizedData = {
      ...reportData,
      quantity_medications: reportData.quantity_medications || null,
      patients_name: reportData.patients_name
        ? reportData.patients_name.split(",").map((name) => name.trim())
        : [],
      medications_name: reportData.medication_used
        ? reportData.medications_name.split(",").map((name) => name.trim())
        : [],
    };

    try {
      const authResponse = await axios.post(
        `${URL_USER}:3001/auth/authorize`,
        { action: "create" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!authResponse.data.authorized) {
        alert("You do not have permission to generate report.");
        return;
      }

      const response = await axios.post(`${URL_REPORT}:3020/reports/generate`, sanitizedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccess("Report generated successfully! Redirecting...");
      setReportData({
        event_name: "",
        event_manager_name: "",
        number_people: "",
        number_volunteers: "",
        patients_attended: "",
        patients_name: "",
        medication_used: false,
        quantity_medications: "",
        medications_name: "",
      });

      setTimeout(() => {
        navigate(`/reports/${response.data.report_id}`);
      }, 1500);
      
    } catch (err) {
      console.error("Error al generar reporte:", err);
      setError(
        `Failed to generate report: ${JSON.stringify(
          err.response?.data,
          null,
          2
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Generate Report</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            name="event_name"
            value={reportData.event_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Event Manager Name</Form.Label>
          <Form.Control
            type="text"
            name="event_manager_name"
            value={reportData.event_manager_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Number of People</Form.Label>
          <Form.Control
            type="number"
            name="number_people"
            value={reportData.number_people}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Number of Volunteers</Form.Label>
          <Form.Control
            type="number"
            name="number_volunteers"
            value={reportData.number_volunteers}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Patients Attended</Form.Label>
          <Form.Control
            type="number"
            name="patients_attended"
            value={reportData.patients_attended}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Patients' Names (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            name="patients_name"
            value={reportData.patients_name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Medication Used"
            name="medication_used"
            checked={reportData.medication_used}
            onChange={handleChange}
          />
        </Form.Group>

        {reportData.medication_used && (
          <>
            <Form.Group>
              <Form.Label>Quantity of Medications</Form.Label>
              <Form.Control
                type="number"
                name="quantity_medications"
                value={reportData.quantity_medications}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Medications' Names (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="medications_name"
                value={reportData.medications_name}
                onChange={handleChange}
              />
            </Form.Group>
          </>
        )}

        <Button
          variant="success"
          type="submit"
          className="mt-3"
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : <FaSave />}{" "}
          Generate Report
        </Button>
      </Form>
    </Container>
  );
};

export default GenerateReport;