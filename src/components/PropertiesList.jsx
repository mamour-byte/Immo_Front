import PropertyCard from "./PropertyCard";

export default function PropertiesList({ properties, favorites, toggleFavorite }) {
  if (!properties?.length) {
    return (
      <p className="text-center py-10 text-gray-500">
        Aucun bien ne correspond à vos critères.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          view="list"
          isFavorite={favorites.includes(property.id)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}
