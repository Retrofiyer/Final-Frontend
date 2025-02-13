import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaSave, FaBackward } from "react-icons/fa";

const URL_USER = import.meta.env.VITE_API_URL_USER;
const URL_REPORT = import.meta.env.VITE_API_URL_REPORTS;

const EditReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [originalReport, setOriginalReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const authResponse = await axios.post(
          `${URL_USER}:3001/auth/authorize`,
          { action: "edit" },
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

        setReportData(response.data);
        setOriginalReport(response.data);
      } catch (err) {
        setError("Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, token]);

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

    const hasChanges = Object.keys(reportData).some(
      (key) => reportData[key] !== originalReport[key]
    );

    if (!hasChanges) {
      setSuccess("No changes detected, report not updated.");
      return;
    }

    try {
      const response = await axios.put(
        `${URL_REPORT}:3022/reports/${reportId}`,
        reportData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(response.data.message);
      alert("✅ Report updated successfully!");
      navigate(`/reports/${reportId}`);
    } catch (err) {
      setError("❌ Error updating report");
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

  return (
    <Container className="mt-4">
      <h2 className="text-center">Edit Report</h2>
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
          <Form.Label>Manager</Form.Label>
          <Form.Control
            type="text"
            name="event_manager_name"
            value={reportData.event_manager_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>People Attended</Form.Label>
          <Form.Control
            type="number"
            name="number_people"
            value={reportData.number_people}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Volunteers</Form.Label>
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
          <Form.Label>Name Patients (separated by commas)</Form.Label>
          <Form.Control
            type="text"
            name="patients_name"
            value={reportData.patients_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Used Medication"
            name="medication_used"
            checked={reportData.medication_used}
            onChange={handleChange}
          />
        </Form.Group>

        {reportData.medication_used && (
          <>
            <Form.Group>
              <Form.Label>Medication Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity_medications"
                value={reportData.quantity_medications}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Medications (separated by commas)</Form.Label>
              <Form.Control
                type="text"
                name="medications_name"
                value={reportData.medications_name.join(", ")}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    medications_name: e.target.value.split(","),
                  })
                }
              />
            </Form.Group>
          </>
        )}
        <div className="d-flex justify-content-center gap-3 mt-3"></div>
        <Button variant="success" onClick={() => navigate(`/reports/${reportId}`)}>
          <FaBackward /> Back
        </Button>

        <Button variant="success" type="submit">
          <FaSave /> Save Changes
        </Button>
        <div/>
      </Form>
    </Container>
  );
};

export default EditReport;
