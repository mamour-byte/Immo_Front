import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SidebarFilters from "../components/SidebarFilters";
import SearchHeader from "../components/SearchHeader";
import PropertiesGrid from "../components/PropertiesGrid";
import PropertyList from "../components/PropertiesList";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useSearchProperties } from "./hooks/useSearchProperties";
import { trackEvent } from "../lib/analytics";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("recent");
  const [favorites, setFavorites] = useState([]);
  const lastResultsSignatureRef = useRef("");

  // Initialiser les filtres depuis les query parameters
  const [filters, setFilters] = useState({
    transactionType: searchParams.get('transactionType') || "",
    propertyType: searchParams.get('propertyType') || "",
    minPrice: searchParams.get('minPrice') || "",
    maxPrice: searchParams.get('maxPrice') || "",
    minSurface: searchParams.get('minSurface') || "",
    maxSurface: searchParams.get('maxSurface') || "",
    bedrooms: searchParams.get('bedrooms') || "",
    bathrooms: searchParams.get('bathrooms') || "",
    cityId: searchParams.get('cityId') || "",
    districtIds: searchParams.getAll('districtId') || [],
    rentalMode: searchParams.get('rentalMode') || "",
    guests: searchParams.get('guests') || "",
    startDate: searchParams.get('startDate') || "",
    endDate: searchParams.get('endDate') || "",
    stayDays: searchParams.get('stayDays') || "",
  });

  // Mettre à jour les filtres si les query parameters changent
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters({
      transactionType: searchParams.get('transactionType') || "",
      propertyType: searchParams.get('propertyType') || "",
      minPrice: searchParams.get('minPrice') || "",
      maxPrice: searchParams.get('maxPrice') || "",
      minSurface: searchParams.get('minSurface') || "",
      maxSurface: searchParams.get('maxSurface') || "",
      bedrooms: searchParams.get('bedrooms') || "",
      bathrooms: searchParams.get('bathrooms') || "",
      cityId: searchParams.get('cityId') || "",
      districtIds: searchParams.getAll('districtId') || [],
      rentalMode: searchParams.get('rentalMode') || "",
      guests: searchParams.get('guests') || "",
      startDate: searchParams.get('startDate') || "",
      endDate: searchParams.get('endDate') || "",
      stayDays: searchParams.get('stayDays') || "",
    });
  }, [searchParams]);

  const { data: properties, isLoading, error } = useSearchProperties(filters, sortBy);

  useEffect(() => {
    if (isLoading || error || !Array.isArray(properties)) return;

    const signature = JSON.stringify({
      sortBy,
      filters,
      count: properties.length,
    });
    if (lastResultsSignatureRef.current === signature) return;
    lastResultsSignatureRef.current = signature;

    trackEvent("search_results_loaded", {
      sort_by: sortBy,
      results_count: properties.length,
      transaction_type: filters.transactionType || "all",
      rental_mode: filters.rentalMode || "all",
      property_type: filters.propertyType || "all",
      city_id: filters.cityId || "",
      district_ids: (filters.districtIds && Array.isArray(filters.districtIds)) ? filters.districtIds.join(',') : "",
      has_budget: Boolean(filters.minPrice || filters.maxPrice),
      has_daily_inputs: Boolean(filters.guests || filters.startDate || filters.endDate || filters.stayDays),
    });
  }, [isLoading, error, properties, sortBy, filters]);

  const handleFiltersChange = useCallback((nextFilters) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }));
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const hasResults = useMemo(
    () => Array.isArray(properties) && properties.length > 0,
    [properties]
  );

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-4 pb-24 sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-4 lg:pb-6">

      {/* Sidebar */}
      <div className="min-w-0 lg:col-span-1">
        <SidebarFilters onFiltersChange={handleFiltersChange} />
      </div>

      {/* Main content */}
      <div className="lg:col-span-3 min-w-0">

        {/* Header (grid/list + sorting) */}
        <SearchHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* States */}
        {isLoading && <LoadingState />}
        {error && <ErrorState message={error.message} />}

        {/* Results */}
        {!isLoading && !error && (
          <>
            {hasResults ? (
              <>
                {viewMode === "grid" && (
                  <PropertiesGrid
                    properties={properties}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                  />
                )}

                {viewMode === "list" && (
                  <PropertyList
                    properties={properties}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                  />
                )}
              </>
            ) : (
              <div className="p-6 bg-white rounded-lg shadow-sm text-center text-text-muted">
                Aucun bien ne correspond à ces critères pour le moment.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
