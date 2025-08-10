import { useState } from "react";
import {
  FiUpload,
  FiFile,
  FiImage,
  FiX,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import "../../styles/Reports.css";

function Reports() {
  const [uploadedReports, setUploadedReports] = useState([
    {
      id: 1,
      name: "Blood Test Report",
      date: "2025-07-10",
      type: "PDF",
      size: "2.4 MB",
      status: "uploaded",
    },
    {
      id: 2,
      name: "X-Ray Scan",
      date: "2025-06-28",
      type: "Image",
      size: "1.8 MB",
      status: "uploaded",
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid file type (PDF, JPG, PNG)");
      return;
    }

    if (file.size > maxSize) {
      alert("File size should not exceed 5MB");
      return;
    }

    setSelectedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      type: file.type.includes("pdf") ? "PDF" : "Image",
      preview: file.type.includes("image") ? URL.createObjectURL(file) : null,
      file: file,
    });
  };

  const confirmUpload = () => {
    if (!selectedFile) return;

    const newReport = {
      id: uploadedReports.length + 1,
      name: selectedFile.name,
      date: new Date().toISOString().split("T")[0],
      type: selectedFile.type,
      size: selectedFile.size,
      status: "uploaded",
    };

    setUploadedReports([newReport, ...uploadedReports]);
    setSelectedFile(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const deleteReport = (id) => {
    setUploadedReports(uploadedReports.filter((report) => report.id !== id));
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Medical Reports</h1>
        <p className="reports-subtitle">View and manage your medical reports</p>
      </div>

      <div
        className={`upload-area ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="file-preview">
            <div className="file-info">
              <div className="file-icon">
                {selectedFile.type === "PDF" ? (
                  <FiFile size={24} />
                ) : (
                  <FiImage size={24} />
                )}
              </div>
              <div className="file-details">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">{selectedFile.size}</span>
              </div>
              <button className="remove-btn" onClick={removeFile}>
                <FiX size={20} />
              </button>
            </div>
            <button className="upload-confirm-btn" onClick={confirmUpload}>
              <FiCheck size={18} /> Confirm Upload
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <FiUpload size={48} className="upload-icon" />
            <p>Drag & drop your file here or</p>
            <label className="browse-btn">
              Browse Files
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            <p className="upload-hint">Supports: PDF, JPG, PNG (Max 5MB)</p>
          </div>
        )}
      </div>

      <div className="reports-list">
        <div className="section-header">
          <h2>Your Reports</h2>
          <span className="badge">{uploadedReports.length} items</span>
        </div>

        {uploadedReports.length === 0 ? (
          <div className="empty-state">
            <p>No reports found. Upload your first report to get started.</p>
          </div>
        ) : (
          <div className="reports-grid">
            {uploadedReports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-icon">
                  {report.type === "PDF" ? (
                    <FiFile size={20} />
                  ) : (
                    <FiImage size={20} />
                  )}
                </div>
                <div className="report-details">
                  <h3 className="report-title">{report.name}</h3>
                  <div className="report-meta">
                    <span className="report-type">{report.type}</span>
                    <span className="report-size">{report.size}</span>
                    <span className="report-date">
                      {formatDate(report.date)}
                    </span>
                  </div>
                </div>
                <div className="report-actions">
                  <button
                    className="delete-btn"
                    onClick={() => deleteReport(report.id)}
                    title="Delete report"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
