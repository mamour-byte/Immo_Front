import { Grid3x3, List, ChevronDown } from "lucide-react";

export default function SearchHeader({ viewMode, setViewMode, sortBy, setSortBy }) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 p-3 sm:p-4 bg-white shadow-sm rounded-lg mb-4">
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

      <div className="min-w-0 flex-1 sm:flex-initial">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto min-w-0 max-w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="recent">Plus récents</option>
          <option value="priceLow">Prix croissant</option>
          <option value="priceHigh">Prix décroissant</option>
        </select>
      </div>
    </div>
  );
}
