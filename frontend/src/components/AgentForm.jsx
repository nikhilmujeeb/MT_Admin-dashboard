import React, { useState } from "react";
import API from "../api/axios";
import { endpoints } from "../config";

const AgentForm = ({ onAgentAdded }) => {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!/^\+\d{1,3}\d{7,14}$/.test(form.mobile)) {
      setMsg("Mobile must include country code, e.g. +91XXXXXXXXXX");
      return;
    }
    setLoading(true);
    try {
      await API.post(endpoints.agents, form);
      setMsg("Agent added successfully!");
      setForm({ name: "", email: "", mobile: "", password: "" });
      if (onAgentAdded) {
        onAgentAdded();
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Error adding agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Add New Agent</h3>
      </div>
      <div className="card-body">
        <form onSubmit={submit}>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Mobile (e.g. +91XXXXXXXXXX)"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="password"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button className="form-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="loading" style={{marginRight: "8px"}}></span>
                Adding Agent...
              </>
            ) : "Add Agent"}
          </button>
          
          {msg && (
            <div className={`message ${msg.includes("Error") ? "error-message" : "success-message"} mt-3`}>
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AgentForm;