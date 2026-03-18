// components/PropertyTable.jsx
import Loading from "./Loading";
import { Edit, Trash } from "lucide-react";

function normalizeStatus(value) {
  return (value ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getStatusBadgeClasses(status) {
  const normalized = normalizeStatus(status);

  if (normalized.includes("disponible") || normalized.includes("available")) {
    return "bg-emerald-100 text-emerald-800";
  }

  if (
    normalized.includes("loue") ||
    normalized.includes("rented") ||
    normalized.includes("vendu") ||
    normalized.includes("vendue") ||
    normalized.includes("sold")
  ) {
    return "bg-red-100 text-red-800";
  }

  if (
    normalized.includes("archive") ||
    normalized.includes("archived") ||
    normalized.includes("en attente") ||
    normalized.includes("pending")
  ) {
    return "bg-orange-100 text-orange-800";
  }

  return "bg-gray-200 text-gray-800";
}

export default function PropertyTable({ data = [], loading, onEdit, onDelete, showAgent = false }) {
  if (loading) return <Loading />;

  if (!data || data.length === 0) {
    return <div className="p-6 text-center text-gray-600">Aucun bien trouvé.</div>;
  }

  function formatPrice(p) {
    if (!p?.price) return "-";
    const suffix =
      p?.purpose === "LOCATION"
        ? p?.rentalMode === "DAILY"
          ? " / jour"
          : " / mois"
        : "";
    return `${Number(p.price).toLocaleString()}${suffix}`;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="p-3">ID</th>
            {showAgent && <th className="p-3">Agent</th>}
            <th className="p-3">Titre</th>
            <th className="p-3">Ville</th>
            <th className="p-3">Quartier</th>
            <th className="p-3">Prix</th>
            <th className="p-3">Mode loc.</th>
            <th className="p-3">Type</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.id}</td>
              {showAgent && (
                <td className="p-3">
                  <div className="font-medium">{p.agent?.fullName || "-"}</div>
                  <div className="text-xs text-slate-600">{p.agent?.email || ""}</div>
                </td>
              )}
              <td className="p-3">{p.title}</td>
              <td className="p-3">{p.city?.name || ""}</td>
              <td className="p-3">{p.district?.name || ""}</td>
              <td className="p-3">{formatPrice(p)}</td>
              <td className="p-3">
                {p.purpose === "LOCATION" ? (p.rentalMode === "DAILY" ? "Journaliere" : "Mensuelle") : "-"}
              </td>
              <td className="p-3">{p.type}</td>
              <td className="p-3">
                <span
                  className={[
                    "inline-flex items-center rounded px-2 py-1 text-xs font-medium",
                    getStatusBadgeClasses(p.status),
                  ].join(" ")}
                >
                  {p.status || "-"}
                </span>
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
