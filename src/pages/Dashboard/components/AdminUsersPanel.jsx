import React, { useMemo, useState } from "react";
import { useDeleteUser, useUpdateUser, useUsers } from "../../Admin/hooks/useAdmin";

export default function AdminUsersPanel() {
  const { data: users, isLoading, isError } = useUsers();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [roleFilter, setRoleFilter] = useState("AGENT");
  const [query, setQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ email: "", fullName: "", phone: "", password: "" });

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
    const ok = window.confirm(next ? "Suspendre cet agent ?" : "Réactiver cet agent ?");
    if (!ok) return;
    updateMutation.mutate({ id: u.id, payload: { isSuspended: next } });
  }

  function removeUser(u) {
    if (u.role !== "AGENT") return;
    const ok = window.confirm("Supprimer définitivement cet agent ?");
    if (!ok) return;
    deleteMutation.mutate(u.id);
  }

  return (
    <section className="bg-white rounded shadow p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-medium">Gestion des agents</h2>
          <p className="text-sm text-gray-600">Modifier, suspendre ou supprimer des comptes agents</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Recherche (email, nom, tÃ©lÃ©phone)"
            className="border rounded px-3 py-2 text-sm w-64"
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
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Nom</th>
                <th className="py-2 pr-4">Téléphone</th>
                <th className="py-2 pr-4">Rôle</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2 pr-4">Créé</th>
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
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                  <td className="py-2 pr-4">
                    {u.role === "AGENT" ? (
                      <div className="flex items-center gap-2">
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
                            u.isSuspended ? "bg-emerald-600 hover:bg-emerald-700" : "bg-orange-600 hover:bg-orange-700"
                          }`}
                        >
                          {u.isSuspended ? "Réactiver" : "Suspendre"}
                        </button>
                        <button
                          onClick={() => removeUser(u)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
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
                <p className="text-sm text-slate-600">{editingUser.email}</p>
              </div>
              <button onClick={closeEdit} className="px-3 py-2 rounded hover:bg-slate-50">
                Fermer
              </button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nom complet" name="fullName" value={editForm.fullName} onChange={onEditChange} />
                <Field label="Téléphone" name="phone" value={editForm.phone} onChange={onEditChange} />
              </div>
              <Field label="Email" name="email" type="email" value={editForm.email} onChange={onEditChange} />
              <Field
                label="Nouveau mot de passe (optionnel)"
                name="password"
                type="password"
                value={editForm.password}
                onChange={onEditChange}
              />
              <div className="flex items-center justify-end gap-3 pt-2">
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
                  className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
      />
    </div>
  );
}
