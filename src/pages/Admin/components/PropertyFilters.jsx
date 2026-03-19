// components/PropertyFilters.jsx
import { useState, useEffect } from "react";
import { useCities, useDistricts } from "../hooks/useProperties";
import { TYPE_OPTIONS, PURPOSE_OPTIONS, RENTAL_MODE_OPTIONS, STATUS_OPTIONS } from "../constants/propertyOptions";

export default function PropertyFilters({ filters, setFilters }) {
  const { data: cities = [] } = useCities();
  const { data: districts = [] } = useDistricts();

  // local state mirroring filters to avoid too many updates
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  function apply() {
    setFilters(local);
  }
  function reset() {
    const defaults = { query: "", type: "", purpose: "", rentalMode: "", cityId: "", districtId: "", status: "", sortField: "createdAt", sortDir: "desc", page: 1, pageSize: 10 };
    setLocal(defaults);
    setFilters(defaults);
  }

  const filteredDistricts = districts.filter((d) => !local.cityId || String(d.cityId) === String(local.cityId));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">Filtres</h3>
      <div className="space-y-3">
        <input value={local.query} onChange={(e) => setLocal({ ...local, query: e.target.value })} placeholder="Recherche texte" className="w-full p-2 border rounded" />

        <select value={local.type} onChange={(e) => setLocal({ ...local, type: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Tous types</option>
          {TYPE_OPTIONS.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
        </select>

        <select value={local.purpose} onChange={(e) => setLocal({ ...local, purpose: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Tous objectifs</option>
          {PURPOSE_OPTIONS.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
        </select>

        <select
          value={local.rentalMode || ""}
          onChange={(e) => setLocal({ ...local, rentalMode: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={local.purpose && local.purpose !== "LOCATION"}
        >
          <option value="">Mode de location (tous)</option>
          {RENTAL_MODE_OPTIONS.map((mode) => (
            <option key={mode.value} value={mode.value}>{mode.label}</option>
          ))}
        </select>

        <select value={local.cityId} onChange={(e) => { setLocal({ ...local, cityId: e.target.value, districtId: "" }) }} className="w-full p-2 border rounded">
          <option value="">Toutes villes</option>
          {cities.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>

        <select value={local.districtId} onChange={(e) => setLocal({ ...local, districtId: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Tous quartiers</option>
          {filteredDistricts.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
        </select>

        <select value={local.status} onChange={(e) => setLocal({ ...local, status: e.target.value })} className="w-full p-2 border rounded">
          <option value="">Tous statuts</option>
          {STATUS_OPTIONS.map(s => (<option key={s.value} value={s.value}>{s.label}</option>))}
        </select>

        <div className="flex gap-2">
          <button onClick={apply} className="flex-1 bg-rose-500 text-white py-2 rounded">Appliquer</button>
          <button onClick={reset} className="flex-1 border py-2 rounded">Réinitialiser</button>
        </div>
      </div>
    </div>
  );
}
