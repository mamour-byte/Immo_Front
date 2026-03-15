import React from "react";
import { useUsers } from "../../Admin/hooks/useAdmin";

export default function AdminUsersPanel() {
  const { data: users, isLoading, isError } = useUsers();

  return (
    <section className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-medium mb-4">Utilisateurs</h2>

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
                  <td colSpan={5} className="py-6 text-center text-gray-600">
                    Aucun utilisateur
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

