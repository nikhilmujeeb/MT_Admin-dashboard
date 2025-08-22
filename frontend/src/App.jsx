import React from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";

const Protected = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

const TopBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  
  return (
    <div className="nav-bar">
      <div className="nav-links">
        {!token && (
          <>
            <Link className="nav-link" to="/">Login</Link>
            <Link className="nav-link" to="/signup">Signup</Link>
          </>
        )}
        {token && (
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
        )}
      </div>
      
      {token && (
        <div className="nav-user">
          {role && <span className="user-role">Logged in as {role}</span>}
          <button className="form-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div className="app-container">
      <TopBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <Protected>
              <Dashboard />
            </Protected>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;