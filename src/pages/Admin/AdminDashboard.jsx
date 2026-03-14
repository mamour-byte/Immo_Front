import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { clearSession } from "../../utils/authUtils";
import { useAgentApplications, useApproveApplication, useRejectApplication, useUsers } from "./hooks/useAdmin";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("applications");
  const [status, setStatus] = useState("PENDING");

  const { data: applications, isLoading: appsLoading, isError: appsError } = useAgentApplications(status);
  const { data: users, isLoading: usersLoading, isError: usersError } = useUsers();

  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  const pendingCount = useMemo(() => (Array.isArray(applications) ? applications.filter((a) => a.status === "PENDING").length : 0), [applications]);

  function logout() {
    clearSession();
    navigate("/login");
  }

  function handleApprove(id) {
    const decisionNote = window.prompt("Message (optionnel) à envoyer à l'agent :", "");
    approveMutation.mutate({ id, decisionNote: decisionNote || undefined });
  }

  function handleReject(id) {
    const decisionNote = window.prompt("Raison / message (optionnel) :", "");
    rejectMutation.mutate({ id, decisionNote: decisionNote || undefined });
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Admin — Gestion</h1>
            <p className="text-sm text-gray-600">Demandes agents ({pendingCount}) · Utilisateurs</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/account" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800">
              Mon compte
            </Link>
            <Link to="/admin/properties" className="px-4 py-2 bg-white border rounded hover:bg-gray-50">
              Biens
            </Link>
            <button onClick={logout} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
              Déconnexion
            </button>
          </div>
        </header>

        <div className="flex items-center gap-2 mb-4">
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

        {tab === "applications" ? (
          <section className="bg-white rounded shadow p-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-medium">Demandes</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Statut</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>

            {appsError && (
              <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700">
                Erreur lors du chargement des demandes.
              </div>
            )}

            {appsLoading ? (
              <p className="text-sm text-gray-600">Chargement...</p>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Agent</th>
                      <th className="py-2 pr-4">Entreprise</th>
                      <th className="py-2 pr-4">Statut</th>
                      <th className="py-2 pr-4">Soumis</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(applications || []).map((app) => (
                      <tr key={app.id} className="border-b">
                        <td className="py-2 pr-4">
                          <div className="font-medium">{app.user?.fullName || "-"}</div>
                          <div className="text-gray-600">{app.user?.email}</div>
                          <div className="text-gray-600">{app.user?.phone || ""}</div>
                        </td>
                        <td className="py-2 pr-4">{app.companyName || "-"}</td>
                        <td className="py-2 pr-4">{app.status}</td>
                        <td className="py-2 pr-4">{app.submittedAt ? new Date(app.submittedAt).toLocaleString() : "-"}</td>
                        <td className="py-2 pr-4">
                          {app.status === "PENDING" ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(app.id)}
                                disabled={approveMutation.isPending}
                                className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                              >
                                Approuver
                              </button>
                              <button
                                onClick={() => handleReject(app.id)}
                                disabled={rejectMutation.isPending}
                                className="px-3 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50"
                              >
                                Refuser
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(applications || []).length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-600">Aucune demande</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          <section className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-medium mb-4">Utilisateurs</h2>
            {usersError && (
              <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700">
                Erreur lors du chargement des utilisateurs.
              </div>
            )}
            {usersLoading ? (
              <p className="text-sm text-gray-600">Chargement...</p>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Nom</th>
                      <th className="py-2 pr-4">Téléphone</th>
                      <th className="py-2 pr-4">Rôle</th>
                      <th className="py-2 pr-4">Créé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users || []).map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="py-2 pr-4">{u.email}</td>
                        <td className="py-2 pr-4">{u.fullName || "-"}</td>
                        <td className="py-2 pr-4">{u.phone || "-"}</td>
                        <td className="py-2 pr-4">{u.role}</td>
                        <td className="py-2 pr-4">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                    {(users || []).length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-600">Aucun utilisateur</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

