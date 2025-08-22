import React, { useState } from "react";
import API from "../api/axios";
import { endpoints } from "../config";

const FileUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [clearExisting, setClearExisting] = useState(true);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
        setMsg("");
      } else {
        setMsg("Please choose a valid file type (.csv, .xlsx, .xls)");
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        setMsg("");
      } else {
        setMsg("Please choose a valid file type (.csv, .xlsx, .xls)");
      }
    }
  };

  const isValidFileType = (file) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    return validTypes.includes(file.type) || 
           file.name.endsWith('.csv') || 
           file.name.endsWith('.xlsx') || 
           file.name.endsWith('.xls');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMsg("");
    
    if (!file) {
      setMsg("Please choose a file (.csv, .xlsx, .xls)");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    
    try {
      const url = `${endpoints.upload}?clearExisting=${clearExisting}`;
      const res = await API.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg(res.data?.message || "Upload successful");
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <div className="card-header">
        <h3 className="card-title">Upload Leads File</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleUpload}>
          <div 
            className={`upload-area ${dragActive ? "active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input").click()}
          >
            <div className="upload-icon">
              📁
            </div>
            <p className="text-center">
              {file ? file.name : "Drag & drop your file here or click to browse"}
            </p>
            <p className="text-center text-sm" style={{color: "var(--text-secondary)"}}>
              Supported formats: CSV, XLSX, XLS
            </p>
          </div>
          
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
            className="file-input"
          />
          
          <div className="form-group mt-4">
            <label className="flex" style={{cursor: "pointer"}}>
              <input
                type="checkbox"
                checked={clearExisting}
                onChange={(e) => setClearExisting(e.target.checked)}
                style={{marginRight: "8px"}}
              />
              Clear previous assignments before distributing
            </label>
          </div>
          
          <button 
            className="form-button mt-4" 
            type="submit" 
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <span className="loading" style={{marginRight: "8px"}}></span>
                Uploading...
              </>
            ) : "Upload File"}
          </button>
        </form>
        
        {msg && (
          <div className={`message ${msg.includes("failed") ? "error-message" : "success-message"} mt-4`}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;