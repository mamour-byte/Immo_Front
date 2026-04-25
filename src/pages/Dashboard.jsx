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
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex w-full flex-col gap-3 shrink-0 sm:w-auto sm:flex-row sm:items-center">
            <Link
              to="/account"
              className="rounded bg-slate-900 px-4 py-2 text-center text-white hover:bg-slate-800"
            >
              Mon compte
            </Link>
            <button
              onClick={logout}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {isAdmin && (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
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
