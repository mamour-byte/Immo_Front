import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearSession } from "../utils/authUtils";
import PropertiesPanel from "./Dashboard/components/PropertiesPanel";
import AdminApplicationsPanel from "./Dashboard/components/AdminApplicationsPanel";
import AdminUsersPanel from "./Dashboard/components/AdminUsersPanel";
import Sidebar from "../components/Sidebar";

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

  // Placeholders pour les KPIs (à remplacer par des vraies données dynamiques)
  const kpis = [
    { label: "Biens", value: 123, color: "text-rose-600" },
    { label: "Utilisateurs", value: 56, color: "text-blue-600" },
    { label: "Demandes d'agent", value: 8, color: "text-green-600" },
    { label: "Visites 3D", value: 42, color: "text-purple-600" },
  ];

  return (
    <div className="flex">
      <Sidebar onLogout={logout} />
      <main className="flex-1 min-h-screen bg-gray-50 px-4 py-6 sm:px-6 pl-64">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate">
                Tableau de bord {isAdmin ? "— Admin" : "— Agent"}
              </h1>
              <p className="text-sm text-gray-600">
                {isAdmin
                  ? "Vue globale, analytics, gestion des biens, comptes et demandes d'agents."
                  : "Suivi de vos biens publiés et de vos performances."}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 shrink-0 sm:w-auto sm:flex-row sm:items-center">
              <Link
                to="/account"
                className="rounded bg-slate-900 px-4 py-2 text-center text-white hover:bg-slate-800"
              >
                Mon compte
              </Link>
            </div>
          </header>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
                <span className="text-gray-500 text-sm">{kpi.label}</span>
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
              </div>
            ))}
          </div>

          {/* Analytics (placeholder graphique) */}
          <div className="bg-white rounded-lg shadow p-6 mb-2">
            <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
            <div className="h-48 flex items-center justify-center text-gray-400">[Graphique à insérer]</div>
          </div>

          {/* Tabs navigation (admin) */}
          {isAdmin && (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center mb-2">
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

          {/* Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Liste des biens */}
            {tab === "properties" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-md font-semibold mb-4">{isAdmin ? "Tous les biens" : "Mes biens"}</h3>
                <PropertiesPanel scope={isAdmin ? "all" : "mine"} showAgent={isAdmin} />
              </div>
            )}
            {/* Liste des utilisateurs */}
            {isAdmin && tab === "users" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-md font-semibold mb-4">Utilisateurs</h3>
                <AdminUsersPanel />
              </div>
            )}
          </div>

          {/* Demandes d'agent */}
          {isAdmin && tab === "applications" && (
            <div className="bg-white rounded-lg shadow p-6 mt-8">
              <h3 className="text-md font-semibold mb-4">Demandes d'agent</h3>
              <AdminApplicationsPanel />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
