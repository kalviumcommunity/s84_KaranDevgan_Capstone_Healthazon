import "../../styles/Reports.css";
import { useState } from "react";

function Reports() {
  const [uploadedReports, setUploadedReports] = useState([
    {
      id: 1,
      name: "Blood Test Report",
      date: "2025-07-10",
      type: "PDF",
    },
    {
      id: 2,
      name: "X-Ray Scan",
      date: "2025-06-28",
      type: "Image",
    },
  ]);

  const [newReport, setNewReport] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newId = uploadedReports.length + 1;
      const newItem = {
        id: newId,
        name: file.name,
        date: new Date().toISOString().split("T")[0],
        type: file.type.includes("pdf") ? "PDF" : "Image",
      };
      setUploadedReports([...uploadedReports, newItem]);
      setNewReport(null);
    }
  };

  return (
    <div className="reports-page">
      <h2>Medical Reports</h2>

      <div className="upload-section">
        <label>Upload New Report:</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleUpload}
        />
      </div>

      <div className="report-list">
        <h3>Uploaded Reports</h3>
        {uploadedReports.length === 0 ? (
          <p>No reports uploaded yet.</p>
        ) : (
          uploadedReports.map((report) => (
            <div key={report.id} className="report-card">
              <div>
                <strong>{report.name}</strong>
                <p>
                  {report.type} — Uploaded on {report.date}
                </p>
              </div>
              <button disabled title="Feature coming soon">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reports;
