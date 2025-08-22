import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { endpoints } from "../config";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await API.post(endpoints.register, { email, password });
      setMsg(res.data?.message || "Admin registered");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed (likely disabled)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container fade-in">
      <h2 className="form-title">Admin Signup</h2>
      <p className="text-center mb-4">
        This endpoint is usually disabled after the first admin is created.
        Ask the developer to temporarily set <code>ADMIN_REGISTRATION_ENABLED=true</code> in backend <code>.env</code>.
      </p>
      <form onSubmit={submit}>
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          className="form-button" 
          type="submit" 
          disabled={loading}
        >
          {loading ? <span className="loading"></span> : "Register"}
        </button>
      </form>
      {msg && (
        <div className={msg.includes("failed") || msg.includes("disabled") ? "message error-message" : "message success-message"}>
          {msg}
        </div>
      )}
      <div className="form-footer">
        Already have an account? <Link className="nav-link" to="/">Login</Link>
      </div>
    </div>
  );
};

export default Signup;