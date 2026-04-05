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

export function mapRentalMode(type) {
  if (!type) return null;
  const normalized = String(type).toLowerCase();
  if (normalized === "daily" || normalized === "journaliere" || normalized === "location-journaliere") {
    return "DAILY";
  }
  if (normalized === "monthly" || normalized === "mensuelle" || normalized === "location-mensuelle" || normalized === "location") {
    return "MONTHLY";
  }
  return null;
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
  if (filters.rentalMode) {
    params.rentalMode = String(filters.rentalMode).toUpperCase();
  } else {
    const mappedRentalMode = mapRentalMode(filters.transactionType);
    if (mappedRentalMode) params.rentalMode = mappedRentalMode;
  }
  if (filters.propertyType) params.type = mapPropertyType(filters.propertyType);

  const numeric = isDailyRental
    ? ["minPrice", "maxPrice", "cityId"]
    : ["minPrice", "maxPrice", "minSurface", "maxSurface", "bedrooms", "bathrooms", "cityId"];

  for (const key of numeric) {
    const raw = filters[key];
    const num = Number(raw);
    if (!isNaN(num) && num > 0) params[key] = num;
  }

  // Gérer les districtIds comme un tableau
  if (filters.districtIds && Array.isArray(filters.districtIds) && filters.districtIds.length > 0) {
    params.districtIds = filters.districtIds.map(id => Number(id)).filter(id => !isNaN(id) && id > 0);
  }

  if (sortBy) {
    const sortMap = {
      priceLow: "price-asc",
      priceHigh: "price-desc",
    };
    params.sortBy = sortMap[sortBy] || sortBy;
  }

  return params;
}
