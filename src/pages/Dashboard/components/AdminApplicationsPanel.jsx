import React, { useMemo, useState } from "react";
import { useAgentApplications, useApproveApplication, useRejectApplication } from "../../Admin/hooks/useAdmin";

export default function AdminApplicationsPanel() {
  const [status, setStatus] = useState("PENDING");
  const [selectedApp, setSelectedApp] = useState(null);
  const { data: applications, isLoading, isError } = useAgentApplications(status);
  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  const pendingCount = useMemo(
    () => (Array.isArray(applications) ? applications.filter((a) => a.status === "PENDING").length : 0),
    [applications],
  );

  function handleApprove(id) {
    const decisionNote = window.prompt("Message (optionnel) à envoyer à l'agent :", "");
    approveMutation.mutate({ id, decisionNote: decisionNote || undefined });
  }

  function handleReject(id) {
    const decisionNote = window.prompt("Raison / message (optionnel) :", "");
    rejectMutation.mutate({ id, decisionNote: decisionNote || undefined });
  }

  return (
    <section className="bg-white rounded shadow p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-medium">Demandes agents</h2>
          <p className="text-sm text-gray-600">En attente: {pendingCount}</p>
        </div>
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

      {isError && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700">
          Erreur lors du chargement des demandes.
        </div>
      )}

      {isLoading ? (
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
                    {app.whatsapp && <div className="text-gray-600">WhatsApp: {app.whatsapp}</div>}
                  </td>
                  <td className="py-2 pr-4">{app.companyName || "-"}</td>
                  <td className="py-2 pr-4">{app.status}</td>
                  <td className="py-2 pr-4">{app.submittedAt ? new Date(app.submittedAt).toLocaleString() : "-"}</td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 text-xs"
                        type="button"
                      >
                        Voir
                      </button>
                      {app.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(app.id)}
                            disabled={approveMutation.isPending}
                            className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 text-xs"
                            type="button"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            disabled={rejectMutation.isPending}
                            className="px-3 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50 text-xs"
                            type="button"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(applications || []).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-600">
                    Aucune demande
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedApp && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Détails de la demande</h3>
                <p className="text-xs text-gray-600">
                  #{selectedApp.id} · {selectedApp.status}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Fermer
              </button>
            </div>

            <div className="px-5 py-4 space-y-4 text-sm">
              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Agent</h4>
                <p><span className="font-medium">Nom:</span> {selectedApp.user?.fullName || "-"}</p>
                <p><span className="font-medium">Email:</span> {selectedApp.user?.email || "-"}</p>
                <p><span className="font-medium">Téléphone:</span> {selectedApp.user?.phone || "-"}</p>
                {selectedApp.whatsapp && (
                  <p><span className="font-medium">WhatsApp:</span> {selectedApp.whatsapp}</p>
                )}
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Profil</h4>
                <p><span className="font-medium">Entreprise:</span> {selectedApp.companyName || "-"}</p>
                {selectedApp.bio && (
                  <p className="mt-1 whitespace-pre-wrap">
                    <span className="font-medium">Bio:</span> {selectedApp.bio}
                  </p>
                )}
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Métadonnées</h4>
                <p>
                  <span className="font-medium">Soumise le:</span>{" "}
                  {selectedApp.submittedAt
                    ? new Date(selectedApp.submittedAt).toLocaleString()
                    : "-"}
                </p>
                {selectedApp.decisionNote && (
                  <p className="mt-1 whitespace-pre-wrap">
                    <span className="font-medium">Note de décision:</span>{" "}
                    {selectedApp.decisionNote}
                  </p>
                )}
              </section>
            </div>

            <div className="px-5 py-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-sm rounded bg-slate-900 text-white hover:bg-slate-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

