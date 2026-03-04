import PropertyCard from "./PropertyCard";
import { useSearchProperties } from "../pages/hooks/useSearchProperties";

export default function PropertiesList({ filters }) {
  const { data, isLoading, isError } = useSearchProperties(filters);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-primary rounded-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Une erreur est survenue lors du chargement des biens.
      </p>
    );
  }

  if (!data?.items?.length) {
    return (
      <p className="text-center py-10 text-gray-500">
        Aucun bien ne correspond à vos critères.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      {data.items.map((property) => (
        <PropertyCard key={property.id} property={property} view="list" />
      ))}
    </div>
  );
}
