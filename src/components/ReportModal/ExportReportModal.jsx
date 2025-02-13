import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaFileExport } from "react-icons/fa";
import axios from "axios";

const URL_USER = import.meta.env.VITE_API_URL_USER;
const URL_REPORT1 = import.meta.env.VITE_API_URL_REPORTS1;

const ExportReportModal = ({ reportId, show, handleClose }) => {
  const [format, setFormat] = useState("pdf");
  const token = localStorage.getItem("token");

  const handleExport = async () => {
    try {
      const authResponse = await axios.post(
        `${URL_USER}:3001/auth/authorize`,
        { action: "export" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!authResponse.data.authorized) {
        setError("You do not have permission to export reports.");
        return;
      }

      const response = await axios.get(
        `${URL_REPORT1}:3026/reports/export/${reportId}?format=${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${reportId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      handleClose();
    } catch (error) {
      console.error("❌ Error exporting report:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Select Format</Form.Label>
            <Form.Control
              as="select"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="info" onClick={handleExport}>
          <FaFileExport /> Export
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportReportModal;