import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { API_URL } from "../pages/services/http";
import { AreaIcon, BathIcon, BedIcon } from "./PropertyIcons";

const STATUS_LABEL = {
  AVAILABLE: "Disponible",
  UNDER_OFFER: "En attente",
  SOLD: "Vendu",
  RENTED: "LouÃ©",
  ARCHIVED: "ArchivÃ©",
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

  const raw =
    typeof rawCandidate === "string"
      ? rawCandidate
      : typeof rawCandidate === "object" && rawCandidate !== null
        ? rawCandidate.url || ""
        : "";

  if (!raw || typeof raw !== "string") return "/placeholder-house.webp";
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
  const purposeLabel =
    property?.purpose === "LOCATION"
      ? property?.rentalMode === "DAILY"
        ? "Location journaliere"
        : "Location mensuelle"
      : PURPOSE_LABEL[property?.purpose] || null;
  const priceSuffix =
    property?.purpose === "LOCATION"
      ? property?.rentalMode === "DAILY"
        ? " / jour"
        : " / mois"
      : "";
  const priceText = formatNumber(property?.price)
    ? `${formatNumber(property?.price)} FCFA${priceSuffix}`
    : "-";

  if (view === "list") {
    return (
      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          <Link
            to={`/property/${property.id}`}
            className="block overflow-hidden bg-slate-200 md:w-72 md:shrink-0"
          >
            <div className="aspect-[4/3] w-full md:h-full md:aspect-auto">
              <img
                src={imageUrl}
                alt={property.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </Link>

          <div className="flex min-w-0 flex-1 flex-col p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                {property.title}
              </h3>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                {property.visits3D?.length > 0 && (
                  <div className="flex items-center gap-1 rounded-full bg-rose-600 px-2 py-1 text-xs font-medium text-white">
                    <Eye size={12} />
                    3D
                  </div>
                )}
                {purposeLabel && (
                  <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-600">
                    {purposeLabel}
                  </span>
                )}
                {statusLabel && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {statusLabel}
                  </span>
                )}
              </div>
            </div>

            {location && <p className="mt-1 truncate text-sm text-slate-500">{location}</p>}

            {property?.description && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-700">
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

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 break-words text-lg font-bold text-rose-500 sm:text-xl">
                {priceText}
              </p>
              <Link
                to={`/property/${property.id}`}
                className="w-full rounded-lg bg-rose-500 px-4 py-2 text-center text-sm text-white transition hover:bg-rose-700 sm:w-auto"
              >
                Voir dÃ©tails
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full flex-shrink-0 overflow-hidden bg-slate-200 sm:h-52 lg:h-56">
        <img
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {purposeLabel && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full border border-white/50 bg-white/90 px-2 py-1 text-xs font-medium text-slate-900 backdrop-blur">
              {purposeLabel}
            </span>
          </div>
        )}
        {property.visits3D?.length > 0 && (
          <div className="absolute right-3 top-3">
            <div className="flex items-center gap-1 rounded-full bg-rose-600 px-2 py-1 text-xs font-medium text-white">
              <Eye size={12} />
              3D
            </div>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col space-y-2 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 sm:text-lg">
          {property.title}
        </h3>

        <p className="line-clamp-2 text-xs text-slate-500 sm:text-sm">
          {property.district?.name}, {property.city?.name}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-slate-600">
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

        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 break-words text-base font-bold text-rose-500 sm:text-xl">
            {(property?.price ?? 0).toLocaleString()} FCFA{priceSuffix}
          </p>

          <Link
            to={`/property/${property.id}`}
            className="w-full rounded-lg bg-rose-500 px-3 py-2 text-center text-xs text-white transition hover:bg-rose-700 touch-manipulation sm:w-auto sm:px-4 sm:text-sm"
          >
            Voir dÃ©tails
          </Link>
        </div>
      </div>
    </div>
  );
}
