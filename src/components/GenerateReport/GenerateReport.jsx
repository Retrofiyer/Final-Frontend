import { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { FaSave } from "react-icons/fa";

const GenerateReport = () => {
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReportData({
      ...reportData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:3020/reports/generate", reportData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Report generated successfully!");
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
    } catch (err) {
      setError("Failed to generate report. Please try again.");
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
          <Form.Control type="text" name="event_name" value={reportData.event_name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Event Manager Name</Form.Label>
          <Form.Control type="text" name="event_manager_name" value={reportData.event_manager_name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Number of People</Form.Label>
          <Form.Control type="number" name="number_people" value={reportData.number_people} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Number of Volunteers</Form.Label>
          <Form.Control type="number" name="number_volunteers" value={reportData.number_volunteers} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Patients Attended</Form.Label>
          <Form.Control type="number" name="patients_attended" value={reportData.patients_attended} onChange={handleChange} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Patients' Names (comma-separated)</Form.Label>
          <Form.Control type="text" name="patients_name" value={reportData.patients_name} onChange={handleChange} />
        </Form.Group>

        <Form.Group>
          <Form.Check type="checkbox" label="Medication Used" name="medication_used" checked={reportData.medication_used} onChange={handleChange} />
        </Form.Group>

        {reportData.medication_used && (
          <>
            <Form.Group>
              <Form.Label>Quantity of Medications</Form.Label>
              <Form.Control type="number" name="quantity_medications" value={reportData.quantity_medications} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Medications' Names (comma-separated)</Form.Label>
              <Form.Control type="text" name="medications_name" value={reportData.medications_name} onChange={handleChange} />
            </Form.Group>
          </>
        )}

        <Button variant="success" type="submit" className="mt-3">
          <FaSave /> Generate Report
        </Button>
      </Form>
    </Container>
  );
};

export default GenerateReport;