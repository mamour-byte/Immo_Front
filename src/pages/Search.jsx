import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SidebarFilters from "../components/SidebarFilters";
import SearchHeader from "../components/SearchHeader";
import PropertiesGrid from "../components/PropertiesGrid";
import PropertyList from "../components/PropertiesList";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useSearchProperties } from "./hooks/useSearchProperties";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [favorites, setFavorites] = useState([]);

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
    districtId: searchParams.get('districtId') || ""
  });

  // Mettre à jour les filtres si les query parameters changent
  useEffect(() => {
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
      districtId: searchParams.get('districtId') || ""
    });
  }, [searchParams]);

  const { data: properties, isLoading, error } = useSearchProperties(filters, sortBy);

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <SidebarFilters onFiltersChange={handleFiltersChange} />
      </div>

      {/* Main content */}
      <div className="lg:col-span-3">

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
              <div className="p-6 bg-white rounded-lg shadow-sm text-center text-slate-600">
                Aucun bien ne correspond à ces critères pour le moment.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}