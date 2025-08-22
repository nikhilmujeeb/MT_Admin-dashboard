// src/config.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export const endpoints = {
  login: `${API_BASE}/api/auth/login`,
  register: `${API_BASE}/api/auth/register`,
  agents: `${API_BASE}/api/agents`,
  upload: `${API_BASE}/api/upload`,
};
