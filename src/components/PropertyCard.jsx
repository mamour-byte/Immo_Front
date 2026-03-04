
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
    <div className="rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Image */}
      <div className="w-full h-56 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {property.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2">
          {property.district?.name}, {property.city?.name}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-xl font-bold text-rose-500">
            {property.price.toLocaleString()} FCFA
          </p>

          <a
            href={`/property/${property.id}`}
            className="text-sm px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Voir détails
          </a>
        </div>
      </div>
    </div>
  );
}
