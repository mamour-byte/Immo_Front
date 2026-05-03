import React, { useMemo, useState } from "react";
import { useDeleteUser, useUpdateUser, useUserDetails, useUsers } from "../../Admin/hooks/useAdmin";

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function renderInfoValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (typeof value === "string" && /^https?:\/\//i.test(value)) {
    return (
      <a href={value} target="_blank" rel="noreferrer" className="text-blue-700 underline break-all">
        {value}
      </a>
    );
  }
  return String(value);
}

function InfoRow({ label, value }) {
  return (
    <p>
      <span className="font-medium text-text-main">{label}:</span> {renderInfoValue(value)}
    </p>
  );
}

export default function AdminUsersPanel() {
  const { data: users, isLoading, isError } = useUsers();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [roleFilter, setRoleFilter] = useState("AGENT");
  const [query, setQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ email: "", fullName: "", phone: "", password: "" });
  const [selectedUserId, setSelectedUserId] = useState(null);

  const {
    data: userDetails,
    isLoading: isUserDetailsLoading,
    isError: isUserDetailsError,
    error: userDetailsError,
  } = useUserDetails(selectedUserId);

  const filteredUsers = useMemo(() => {
    const items = Array.isArray(users) ? users : [];
    const q = query.trim().toLowerCase();
    return items
      .filter((u) => (roleFilter === "ALL" ? true : u.role === roleFilter))
      .filter((u) => {
        if (!q) return true;
        return (
          String(u.email || "").toLowerCase().includes(q) ||
          String(u.fullName || "").toLowerCase().includes(q) ||
          String(u.phone || "").toLowerCase().includes(q)
        );
      });
  }, [users, roleFilter, query]);

  function openEdit(u) {
    setEditingUser(u);
    setEditForm({
      email: u.email || "",
      fullName: u.fullName || "",
      phone: u.phone || "",
      password: "",
    });
  }

  function closeEdit() {
    setEditingUser(null);
    setEditForm({ email: "", fullName: "", phone: "", password: "" });
  }

  function onEditChange(e) {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!editingUser) return;
    const payload = {
      email: editForm.email,
      fullName: editForm.fullName,
      phone: editForm.phone,
      ...(editForm.password ? { password: editForm.password } : {}),
    };
    updateMutation.mutate(
      { id: editingUser.id, payload },
      {
        onSuccess: () => closeEdit(),
      },
    );
  }

  function toggleSuspend(u) {
    if (u.role !== "AGENT") return;
    const next = !u.isSuspended;
    const ok = window.confirm(next ? "Suspendre cet agent ?" : "Reactiver cet agent ?");
    if (!ok) return;
    updateMutation.mutate({ id: u.id, payload: { isSuspended: next } });
  }

  function removeUser(u) {
    if (u.role !== "AGENT") return;
    const ok = window.confirm("Supprimer definitivement cet agent ?");
    if (!ok) return;
    deleteMutation.mutate(u.id);
  }

  function openDetails(u) {
    setSelectedUserId(u.id);
  }

  function closeDetails() {
    setSelectedUserId(null);
  }

  const detailErrorMessage = useMemo(() => {
    const msg = userDetailsError?.response?.data?.message || userDetailsError?.message;
    return Array.isArray(msg) ? msg[0] : msg;
  }, [userDetailsError]);

  const application = userDetails?.agentApplication;
  const profile = userDetails?.agentProfile;
  const counts = userDetails?._count;

  return (
    <section className="bg-white rounded shadow p-4">
      <div className="mb-4 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-medium">Gestion des agents</h2>
          <p className="text-sm text-gray-600">Modifier, suspendre, supprimer ou consulter les comptes</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Recherche (email, nom, telephone)"
            className="w-full rounded border px-3 py-2 text-sm sm:w-64"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="AGENT">AGENTS</option>
            <option value="USER">USERS</option>
            <option value="ADMIN">ADMINS</option>
            <option value="ALL">TOUS</option>
          </select>
        </div>
      </div>

      {isError && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700">
          Erreur lors du chargement des utilisateurs.
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-600">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Nom</th>
                <th className="py-2 pr-4">Telephone</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2 pr-4">Cree</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.fullName || "-"}</td>
                  <td className="py-2 pr-4">{u.phone || "-"}</td>
                  <td className="py-2 pr-4">{u.role}</td>
                  <td className="py-2 pr-4">
                    {u.role === "AGENT" ? (
                      u.isSuspended ? (
                        <span className="inline-flex px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-medium">
                          SUSPENDU
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-medium">
                          ACTIF
                        </span>
                      )
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => openDetails(u)}
                        className="px-3 py-2 bg-white border rounded hover:bg-gray-50"
                        type="button"
                      >
                        Voir fiche
                      </button>

                      {u.role === "AGENT" && (
                        <>
                          <button
                            onClick={() => openEdit(u)}
                            className="px-3 py-2 bg-white border rounded hover:bg-gray-50"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => toggleSuspend(u)}
                            disabled={updateMutation.isPending}
                            className={`px-3 py-2 rounded text-white disabled:opacity-50 ${
                              u.isSuspended
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-orange-600 hover:bg-orange-700"
                            }`}
                          >
                            {u.isSuspended ? "Reactiver" : "Suspendre"}
                          </button>
                          <button
                            onClick={() => removeUser(u)}
                            disabled={deleteMutation.isPending}
                            className="px-3 py-2 bg-primary text-white rounded hover:bg-primary-hover disabled:opacity-50"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-600">
                    Aucun utilisateur
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold">Modifier l'agent</h3>
                <p className="text-sm text-text-muted">{editingUser.email}</p>
              </div>
              <button onClick={closeEdit} className="px-3 py-2 rounded hover:bg-surface">
                Fermer
              </button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nom complet" name="fullName" value={editForm.fullName} onChange={onEditChange} />
                <Field label="Telephone" name="phone" value={editForm.phone} onChange={onEditChange} />
              </div>
              <Field label="Email" name="email" type="email" value={editForm.email} onChange={onEditChange} />
              <Field
                label="Nouveau mot de passe (optionnel)"
                name="password"
                type="password"
                value={editForm.password}
                onChange={onEditChange}
              />
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 bg-white border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-primary-dark text-white rounded hover:bg-primary-dark disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUserId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-lg">
            <div className="px-5 py-4 border-b flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Fiche utilisateur</h3>
                <p className="text-sm text-text-muted">{userDetails?.email || "Chargement..."}</p>
              </div>
              <button onClick={closeDetails} className="px-3 py-2 rounded hover:bg-surface" type="button">
                Fermer
              </button>
            </div>

            <div className="px-5 py-4 space-y-6 text-sm">
              {isUserDetailsLoading && <p className="text-text-muted">Chargement des details...</p>}

              {isUserDetailsError && (
                <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700">
                  {detailErrorMessage || "Impossible de charger la fiche utilisateur."}
                </div>
              )}

              {!isUserDetailsLoading && !isUserDetailsError && userDetails && (
                <>
                  <section className="space-y-2">
                    <h4 className="font-semibold text-text-main">Compte</h4>
                    <InfoRow label="ID" value={userDetails.id} />
                    <InfoRow label="Role" value={userDetails.role} />
                    <InfoRow label="Nom" value={userDetails.fullName} />
                    <InfoRow label="Email" value={userDetails.email} />
                    <InfoRow label="Telephone" value={userDetails.phone} />
                    <InfoRow label="Suspendu" value={userDetails.isSuspended} />
                    <InfoRow label="Creation" value={formatDateTime(userDetails.createdAt)} />
                    <InfoRow label="Mise a jour" value={formatDateTime(userDetails.updatedAt)} />
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-semibold text-text-main">Activite</h4>
                    <InfoRow label="Biens rattaches" value={counts?.properties} />
                    <InfoRow label="Favoris" value={counts?.favorites} />
                    <InfoRow label="Rdv en tant que demandeur" value={counts?.appointmentsAsUser} />
                    <InfoRow label="Rdv en tant qu'agent" value={counts?.appointmentsAsAgent} />
                  </section>

                  {application && (
                    <section className="space-y-2">
                      <h4 className="font-semibold text-text-main">Demande agent</h4>
                      <InfoRow label="Statut" value={application.status} />
                      <InfoRow label="Type profil" value={application.profileType} />
                      <InfoRow label="Prenom" value={application.firstName} />
                      <InfoRow label="Nom" value={application.lastName} />
                      <InfoRow label="Ville" value={application.city} />
                      <InfoRow label="Adresse" value={application.address} />
                      <InfoRow label="Societe / agence" value={application.agencyName || application.companyName} />
                      <InfoRow label="Whatsapp" value={application.whatsapp} />
                      <InfoRow label="Telephone public" value={application.publicPhone} />
                      <InfoRow label="Langues" value={application.languages} />
                      <InfoRow label="Zone d'activite" value={application.activityZone} />
                      <InfoRow label="Annees experience" value={application.yearsExperience} />
                      <InfoRow label="Biens geres" value={application.managedPropertiesCount} />
                      <InfoRow label="Site web" value={application.websiteUrl} />
                      <InfoRow label="Facebook" value={application.facebookUrl} />
                      <InfoRow label="Description" value={application.publicDescription || application.bio} />
                      <InfoRow label="Photo profil" value={application.profilePhotoUrl || application.avatarUrl} />
                      <InfoRow label="Piece identite" value={application.idDocumentUrl} />
                      <InfoRow label="Registre commerce" value={application.tradeRegisterUrl} />
                      <InfoRow label="Carte pro" value={application.professionalCardUrl} />
                      <InfoRow label="Logo agence" value={application.agencyLogoUrl} />
                      <InfoRow label="Photo agence" value={application.agencyPhotoUrl} />
                      <InfoRow label="Soumis le" value={formatDateTime(application.submittedAt)} />
                      <InfoRow label="Revu le" value={formatDateTime(application.reviewedAt)} />
                      <InfoRow label="Note decision" value={application.decisionNote} />
                    </section>
                  )}

                  {profile && (
                    <section className="space-y-2">
                      <h4 className="font-semibold text-text-main">Profil agent actif</h4>
                      <InfoRow label="Type profil" value={profile.profileType} />
                      <InfoRow label="Nom agence" value={profile.agencyName} />
                      <InfoRow label="Societe" value={profile.companyName} />
                      <InfoRow label="Whatsapp" value={profile.whatsapp} />
                      <InfoRow label="Telephone public" value={profile.publicPhone} />
                      <InfoRow label="Langues" value={profile.languages} />
                      <InfoRow label="Ville" value={profile.city} />
                      <InfoRow label="Adresse" value={profile.address} />
                      <InfoRow label="Zone d'activite" value={profile.activityZone} />
                      <InfoRow label="Annees experience" value={profile.yearsExperience} />
                      <InfoRow label="Biens geres" value={profile.managedPropertiesCount} />
                      <InfoRow label="Site web" value={profile.websiteUrl} />
                      <InfoRow label="Facebook" value={profile.facebookUrl} />
                      <InfoRow label="Bio publique" value={profile.publicDescription || profile.bio} />
                      <InfoRow label="Avatar" value={profile.avatarUrl} />
                      <InfoRow label="Logo agence" value={profile.agencyLogoUrl} />
                      <InfoRow label="Photo agence" value={profile.agencyPhotoUrl} />
                    </section>
                  )}
                </>
              )}
            </div>

            <div className="px-5 py-3 border-t flex justify-end">
              <button
                type="button"
                onClick={closeDetails}
                className="px-4 py-2 text-sm rounded bg-primary-dark text-white hover:bg-primary-dark"
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

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-main mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all text-text-main"
      />
    </div>
  );
}
