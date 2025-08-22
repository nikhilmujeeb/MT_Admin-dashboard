import { useEffect, useState } from "react";
import API from "../api/axios";
import AgentForm from "../components/AgentForm";
import AgentList from "../components/AgentList";
import FileUpload from "../components/FileUpload";

export default function Dashboard() {
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [agents, setAgents] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    
    if (role === "admin") {
      fetchAgents();
    }
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await API.get("/agents");
      setAgents(res.data || []);
      setMsg("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to fetch agents");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
      </div>
      
      {msg && (
        <div className="message error-message mb-4">
          {msg}
        </div>
      )}
      
      {userRole === "admin" ? (
        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Add New Agent</h3>
            </div>
            <div className="card-body">
              <AgentForm onAgentAdded={fetchAgents} />
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Upload Leads</h3>
            </div>
            <div className="card-body">
              <FileUpload onUploadComplete={fetchAgents} />
            </div>
          </div>
        </div>
      ) : (
        <div className="message error-message">
          You don't have permission to view this page.
        </div>
      )}
      
      <div className="agent-list mt-5">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Agents & Assigned Leads</h3>
          </div>
          <div className="card-body">
            <AgentList agents={agents} />
          </div>
        </div>
      </div>
    </div>
  );
}