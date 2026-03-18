export function mapTransactionType(type) {
  if (!type) return null;

  const mapping = {
    achat: "VENTE",
    location: "LOCATION",
    "location-journaliere": "LOCATION",
    "location_journaliere": "LOCATION",
    journaliere: "LOCATION",
  };

  if (["VENTE", "LOCATION"].includes(type.toUpperCase())) {
    return type.toUpperCase();
  }
  return mapping[type.toLowerCase()] || null;
}

export function mapPropertyType(type) {
  if (!type) return null;

  const mapping = {
    appartement: "APPARTMENT",
    maison: "MAISON",
    terrain: "TERRAIN",
    bureau: "BUREAU",
    commerce: "LOCAL_COMMERCE"
  };

  const enums = [
    "APPARTMENT", "STUDIO", "MAISON", "TERRAIN",
    "BUREAU", "LOCAL_COMMERCE", "AUTRE",
  ];

  if (enums.includes(type.toUpperCase())) return type.toUpperCase();

  return mapping[type.toLowerCase()] || null;
}

export function buildPropertyQuery(filters = {}, sortBy) {
  const params = {};
  const isDailyRental = String(filters.transactionType || "").toLowerCase() === "location-journaliere";

  if (filters.transactionType) params.purpose = mapTransactionType(filters.transactionType);
  if (filters.propertyType) params.type = mapPropertyType(filters.propertyType);

  const numeric = isDailyRental
    ? ["minPrice", "maxPrice", "cityId", "districtId"]
    : ["minPrice", "maxPrice", "minSurface", "maxSurface", "bedrooms", "bathrooms", "cityId", "districtId"];

  for (const key of numeric) {
    const raw = filters[key];
    const num = Number(raw);
    if (!isNaN(num) && num > 0) params[key] = num;
  }

  if (sortBy) params.sortBy = sortBy;

  return params;
}
