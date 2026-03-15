import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearSession } from "../utils/authUtils";
import PropertiesPanel from "./Dashboard/components/PropertiesPanel";
import AdminApplicationsPanel from "./Dashboard/components/AdminApplicationsPanel";
import AdminUsersPanel from "./Dashboard/components/AdminUsersPanel";

function getStoredUser() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem("jwt") || sessionStorage.getItem("jwt") || null;
}

function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getRoleFromSession() {
  const storedUser = getStoredUser();
  if (storedUser?.role) return storedUser.role;
  const token = getJwt();
  return decodeJwtPayload(token)?.role || null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const role = useMemo(() => getRoleFromSession(), []);
  const isAdmin = role === "ADMIN";

  const [tab, setTab] = useState("properties");

  function logout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold truncate">
              Dashboard {isAdmin ? "— Admin" : "— Agent"}
            </h1>
            <p className="text-sm text-gray-600">
              {isAdmin
                ? "Gestion des biens, comptes et demandes d'agents"
                : "Gestion de vos biens publiés"}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/account"
              className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800"
            >
              Mon compte
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("properties")}
              className={`px-4 py-2 rounded ${tab === "properties" ? "bg-slate-900 text-white" : "bg-white border hover:bg-gray-50"}`}
            >
              Biens
            </button>
            <button
              onClick={() => setTab("applications")}
              className={`px-4 py-2 rounded ${tab === "applications" ? "bg-slate-900 text-white" : "bg-white border hover:bg-gray-50"}`}
            >
              Demandes agents
            </button>
            <button
              onClick={() => setTab("users")}
              className={`px-4 py-2 rounded ${tab === "users" ? "bg-slate-900 text-white" : "bg-white border hover:bg-gray-50"}`}
            >
              Utilisateurs
            </button>
          </div>
        )}

        {tab === "properties" && (
          <PropertiesPanel scope={isAdmin ? "all" : "mine"} showAgent={isAdmin} />
        )}
        {isAdmin && tab === "applications" && <AdminApplicationsPanel />}
        {isAdmin && tab === "users" && <AdminUsersPanel />}
      </div>
    </div>
  );
}

