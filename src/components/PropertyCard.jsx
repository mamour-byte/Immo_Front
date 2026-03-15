import { Link } from "react-router-dom";
import { API_URL } from "../pages/services/http";
import { AreaIcon, BathIcon, BedIcon } from "./PropertyIcons";

const STATUS_LABEL = {
  AVAILABLE: "Disponible",
  UNDER_OFFER: "En attente",
  SOLD: "Vendu",
  RENTED: "Loué",
  ARCHIVED: "Archivé",
};

const PURPOSE_LABEL = {
  VENTE: "Vente",
  LOCATION: "Location",
};

function formatNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return num.toLocaleString();
}

function MetaItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

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

export default function PropertyCard({ property, view = "grid" }) {
  const imageUrl = buildImageUrl(property);
  const location = [property?.district?.name, property?.city?.name]
    .filter(Boolean)
    .join(", ");
  const statusLabel = STATUS_LABEL[property?.status] || property?.status || null;
  const purposeLabel = PURPOSE_LABEL[property?.purpose] || null;
  const priceText = formatNumber(property?.price) ? `${formatNumber(property?.price)} FCFA` : "-";

  if (view === "list") {
    return (
      <div className="rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="flex flex-col md:flex-row">
          <Link
            to={`/property/${property.id}`}
            className="block md:w-72 md:shrink-0 bg-slate-200 overflow-hidden"
          >
            <div className="w-full aspect-[4/3] md:aspect-auto md:h-full">
              <img
                src={imageUrl}
                alt={property.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Link>

          <div className="p-4 md:p-5 flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug line-clamp-2">
                {property.title}
              </h3>
              <div className="shrink-0 flex flex-wrap items-center justify-end gap-2">
                {purposeLabel && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-rose-50 text-rose-600">
                    {purposeLabel}
                  </span>
                )}
                {statusLabel && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    {statusLabel}
                  </span>
                )}
              </div>
            </div>

            {location && (
              <p className="mt-1 text-sm text-slate-500 truncate">
                {location}
              </p>
            )}

            {property?.description && (
              <p className="mt-3 text-sm text-slate-700 leading-relaxed line-clamp-3">
                {property.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              {Number.isFinite(Number(property?.bedrooms)) && (
                <MetaItem icon={<BedIcon />} text={`${Number(property.bedrooms)} ch`} />
              )}
              {Number.isFinite(Number(property?.bathrooms)) && (
                <MetaItem icon={<BathIcon />} text={`${Number(property.bathrooms)} sdb`} />
              )}
              {Number.isFinite(Number(property?.surfaceM2 ?? property?.surface)) && (
                <MetaItem
                  icon={<AreaIcon />}
                  text={`${Number(property.surfaceM2 ?? property.surface)} m2`}
                />
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <p className="text-lg sm:text-xl font-bold text-rose-500 truncate min-w-0">
                {priceText}
              </p>
              <Link
                to={`/property/${property.id}`}
                className="text-sm px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-700 transition flex-shrink-0"
              >
                Voir détails
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      {/* Image */}
      <div className="w-full aspect-[4/3] sm:h-52 lg:h-56 bg-slate-200 overflow-hidden flex-shrink-0 relative">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {purposeLabel && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/90 text-slate-900 backdrop-blur border border-white/50">
              {purposeLabel}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 flex flex-col flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2">
          {property.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
          {property.district?.name}, {property.city?.name}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
          {Number.isFinite(Number(property?.bedrooms)) && (
            <MetaItem icon={<BedIcon />} text={`${Number(property.bedrooms)} ch`} />
          )}
          {Number.isFinite(Number(property?.bathrooms)) && (
            <MetaItem icon={<BathIcon />} text={`${Number(property.bathrooms)} sdb`} />
          )}
          {Number.isFinite(Number(property?.surfaceM2 ?? property?.surface)) && (
            <MetaItem
              icon={<AreaIcon />}
              text={`${Number(property.surfaceM2 ?? property.surface)} m2`}
            />
          )}
        </div>

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
