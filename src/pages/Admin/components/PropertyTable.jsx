// components/PropertyTable.jsx
import Loading from "./Loading";
import { Edit, Trash } from "lucide-react";

export default function PropertyTable({ data = [], loading, onEdit, onDelete }) {
  if (loading) return <Loading />;

  if (!data || data.length === 0) {
    return <div className="p-6 text-center text-gray-600">Aucun bien trouvé.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Titre</th>
            <th className="p-3">Ville</th>
            <th className="p-3">Quartier</th>
            <th className="p-3">Prix</th>
            <th className="p-3">Type</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.id}</td>
              <td className="p-3">{p.title}</td>
              <td className="p-3">{p.city?.name || ""}</td>
              <td className="p-3">{p.district?.name || ""}</td>
              <td className="p-3">{p.price ? Number(p.price).toLocaleString() : "-"}</td>
              <td className="p-3">{p.type}</td>
              <td className="p-3">
                <span className="px-2 py-1 rounded text-xs bg-gray-200">{p.status || "-"}</span>
              </td>
              <td className="p-3 flex items-center gap-3">
                <button onClick={() => onEdit(p)} title="Editer" className="p-1">
                  <Edit size={16} className="text-blue-500" />
                </button>
                <button onClick={() => onDelete(p.id)} title="Supprimer" className="p-1">
                  <Trash size={16} className="text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
