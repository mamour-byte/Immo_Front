import axios from "axios";
import { clearSession } from "../../../utils/authUtils";

const API_URL = import.meta.env.VITE_API_URL || "https://immo-backend-b2x5.onrender.com";

function getJwt() {
  return localStorage.getItem("jwt") || sessionStorage.getItem("jwt") || null;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((cfg) => {
  const token = getJwt();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      clearSession();
      window.location.replace("/login");
    }
    return Promise.reject(err);
  }
);

export async function fetchUsers() {
  const res = await api.get("/users");
  return res.data;
}

export async function updateUser(id, payload) {
  const res = await api.patch(`/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}

export async function fetchAgentApplications(status) {
  const params = status ? { status } : undefined;
  const res = await api.get("/agent-applications", { params });
  return res.data;
}

export async function approveAgentApplication(id, decisionNote) {
  const res = await api.post(`/agent-applications/${id}/approve`, { decisionNote });
  return res.data;
}

export async function rejectAgentApplication(id, decisionNote) {
  const res = await api.post(`/agent-applications/${id}/reject`, { decisionNote });
  return res.data;
}
