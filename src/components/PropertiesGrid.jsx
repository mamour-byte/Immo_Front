import PropertyCard from "./PropertyCard";

export default function PropertiesGrid({ properties, favorites, toggleFavorite }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          toggleFavorite={toggleFavorite}
          isFavorite={favorites.includes(p.id)}
        />
      ))}
    </div>
  );
}
