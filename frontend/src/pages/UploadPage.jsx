import React, { useState } from "react";
import API from "../api/axios";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [clearExisting, setClearExisting] = useState(true);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post(`/upload?clearExisting=${clearExisting}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload CSV/XLSX</h2>
      <input type="file" onChange={handleFileChange} accept=".csv,.xlsx,.xls" />
      <br />
      <label>
        <input
          type="checkbox"
          checked={clearExisting}
          onChange={(e) => setClearExisting(e.target.checked)}
        />
        Clear previous assignments before distributing
      </label>
      <br />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadPage;