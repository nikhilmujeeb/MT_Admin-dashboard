import { useState, useEffect } from "react";
import API from "../api/axios";
import { endpoints } from "../config";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [msg, setMsg] = useState("");

  const fetchAgents = async () => {
    try {
      const res = await API.get(endpoints.agents);
      setAgents(res.data || []);
      setMsg("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to load agents");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const onRefresh = () => {
    fetchAgents();
  };

  return (
    <div className="agent-list">
      <div className="card">
        <div className="card-header flex-between">
          <h3 className="card-title">Agents ({agents.length})</h3>
          <button className="form-button" onClick={onRefresh}>
            Refresh
          </button>
        </div>
        <div className="card-body">
          {msg && (
            <div className="message error-message mb-3">
              {msg}
            </div>
          )}
          
          {agents.length > 0 ? (
            <div className="agent-grid">
              {agents.map((agent) => (
                <div key={agent._id} className="agent-item">
                  <div className="agent-header">
                    <h4 className="agent-name">{agent.name}</h4>
                    <span className="agent-badge">{agent.assignedList?.length || 0} leads</span>
                  </div>
                  <div className="agent-contact">
                    <p><strong>Email:</strong> {agent.email}</p>
                    <p><strong>Mobile:</strong> {agent.mobile}</p>
                  </div>
                  
                  {agent.assignedList && agent.assignedList.length > 0 && (
                    <div className="assigned-list mt-3">
                      <h5>Assigned Leads:</h5>
                      <div className="assigned-grid">
                        {agent.assignedList.map((item, idx) => (
                          <div key={idx} className="assigned-item">
                            <p><strong>{item.firstname}</strong> - {item.phone}</p>
                            <p className="text-sm">{item.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No agents yet. Add your first agent above.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentList;