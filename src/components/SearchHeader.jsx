import { Grid3x3, List, ChevronDown } from "lucide-react";

export default function SearchHeader({ viewMode, setViewMode, sortBy, setSortBy }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg mb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded ${viewMode === "grid" ? "bg-rose-500 text-white" : "bg-gray-100"}`}
        >
          <Grid3x3 size={20} />
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded ${viewMode === "list" ? "bg-rose-500 text-white" : "bg-gray-100"}`}
        >
          <List size={20} />
        </button>
      </div>

      <div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="recent">Plus récents</option>
          <option value="priceLow">Prix croissant</option>
          <option value="priceHigh">Prix décroissant</option>
        </select>
      </div>
    </div>
  );
}
