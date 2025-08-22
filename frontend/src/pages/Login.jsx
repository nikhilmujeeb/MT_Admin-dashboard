import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { endpoints } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await API.post(endpoints.login, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      setMsg("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container fade-in">
      <h2 className="form-title">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Email"
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
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? <span className="loading"></span> : "Login"}
        </button>
      </form>
      {msg && (
        <div className={msg.includes("failed") ? "message error-message" : "message success-message"}>
          {msg}
        </div>
      )}
      <div className="form-footer">
        <p>
          Need an admin account? <Link className="nav-link" to="/signup">Sign up</Link>
        </p>
        <p className="mt-2">
          Are you an agent? <Link className="nav-link" to="/agent-login">Agent Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;