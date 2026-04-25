import { Grid3x3, List, ChevronDown } from "lucide-react";

export default function SearchHeader({ viewMode, setViewMode, sortBy, setSortBy }) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2.5 rounded-lg touch-manipulation ${viewMode === "grid" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600"}`}
          aria-label="Vue grille"
        >
          <Grid3x3 size={20} className="w-5 h-5" />
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`p-2.5 rounded-lg touch-manipulation ${viewMode === "list" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600"}`}
          aria-label="Vue liste"
        >
          <List size={20} className="w-5 h-5" />
        </button>
      </div>

      <div className="min-w-0 w-full sm:w-auto sm:flex-initial">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 sm:w-auto"
        >
          <option value="recent">Plus récents</option>
          <option value="priceLow">Prix croissant</option>
          <option value="priceHigh">Prix décroissant</option>
        </select>
      </div>
    </div>
  );
}
