// components/PropertyFilters.jsx
import { useEffect, useState } from "react";
import { useCities, useDistricts } from "../hooks/useProperties";
import { PURPOSE_OPTIONS, RENTAL_MODE_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS } from "../constants/propertyOptions";

const DEFAULTS = {
  query: "",
  type: "",
  purpose: "",
  rentalMode: "",
  cityId: "",
  districtId: "",
  status: "",
  sortField: "createdAt",
  sortDir: "desc",
  page: 1,
  pageSize: 10,
};

const inputClass = "w-full rounded-lg border border-border bg-white p-2 text-sm text-text-main";

export default function PropertyFilters({ filters, setFilters }) {
  const { data: cities = [] } = useCities();
  const { data: districts = [] } = useDistricts();
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  function apply() {
    setFilters(local);
  }

  function reset() {
    setLocal(DEFAULTS);
    setFilters(DEFAULTS);
  }

  const filteredDistricts = districts.filter((d) => !local.cityId || String(d.cityId) === String(local.cityId));

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-950">Filtres</h3>
      <div className="space-y-3">
        <input
          value={local.query}
          onChange={(e) => setLocal({ ...local, query: e.target.value })}
          placeholder="Recherche texte"
          className={inputClass}
        />

        <select value={local.type} onChange={(e) => setLocal({ ...local, type: e.target.value })} className={inputClass}>
          <option value="">Tous types</option>
          {TYPE_OPTIONS.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        <select value={local.purpose} onChange={(e) => setLocal({ ...local, purpose: e.target.value })} className={inputClass}>
          <option value="">Tous objectifs</option>
          {PURPOSE_OPTIONS.map((purpose) => (
            <option key={purpose.value} value={purpose.value}>{purpose.label}</option>
          ))}
        </select>

        <select
          value={local.rentalMode || ""}
          onChange={(e) => setLocal({ ...local, rentalMode: e.target.value })}
          className={`${inputClass} disabled:bg-surface`}
          disabled={local.purpose && local.purpose !== "LOCATION"}
        >
          <option value="">Mode de location (tous)</option>
          {RENTAL_MODE_OPTIONS.map((mode) => (
            <option key={mode.value} value={mode.value}>{mode.label}</option>
          ))}
        </select>

        <select
          value={local.cityId}
          onChange={(e) => setLocal({ ...local, cityId: e.target.value, districtId: "" })}
          className={inputClass}
        >
          <option value="">Toutes villes</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>

        <select
          value={local.districtId}
          onChange={(e) => setLocal({ ...local, districtId: e.target.value })}
          className={inputClass}
        >
          <option value="">Tous quartiers</option>
          {filteredDistricts.map((district) => (
            <option key={district.id} value={district.id}>{district.name}</option>
          ))}
        </select>

        <select value={local.status} onChange={(e) => setLocal({ ...local, status: e.target.value })} className={inputClass}>
          <option value="">Tous statuts</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button onClick={apply} className="flex-1 rounded-lg bg-primary-dark py-2 text-sm font-semibold text-white">
            Appliquer
          </button>
          <button onClick={reset} className="flex-1 rounded-lg border border-border bg-white py-2 text-sm font-medium text-text-main">
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
