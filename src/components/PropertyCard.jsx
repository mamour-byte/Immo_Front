import { Link } from "react-router-dom";
import { API_URL } from "../pages/services/http";

function buildImageUrl(property) {
  const baseUrl = import.meta.env.VITE_API_URL || API_URL;
  const rawCandidate =
    property?.thumbnail ||
    property?.image ||
    property?.images?.[0] ||
    "";

  // Some APIs return objects { url: "..."} or non-string values
  const raw =
    typeof rawCandidate === "string"
      ? rawCandidate
      : typeof rawCandidate === "object" && rawCandidate !== null
        ? rawCandidate.url || ""
        : "";

  if (!raw) return "/placeholder-house.webp";
  if (typeof raw !== "string") return "/placeholder-house.webp";
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/")) return `${baseUrl}${raw}`;
  return `${baseUrl}/${raw}`;
}

export default function PropertyCard({ property }) {
  const imageUrl = buildImageUrl(property);

  return (
    <div className="rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      {/* Image */}
      <div className="w-full aspect-[4/3] sm:h-52 lg:h-56 bg-slate-200 overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 flex flex-col flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2">
          {property.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
          {property.district?.name}, {property.city?.name}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-2">
          <p className="text-base sm:text-xl font-bold text-rose-500 truncate min-w-0">
            {(property?.price ?? 0).toLocaleString()} FCFA
          </p>

          <Link
            to={`/property/${property.id}`}
            className="text-xs sm:text-sm px-3 sm:px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-700 transition flex-shrink-0 touch-manipulation"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
}
