import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function SimilarPropertyCard({ property }) {
  const images = property.images?.length ? property.images.map(i => i.url) : ['https://picsum.photos/500/300?random'];
  const priceSuffix =
    property?.purpose === "LOCATION"
      ? property?.rentalMode === "DAILY"
        ? " / jour"
        : " / mois"
      : "";
  
  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <Link
      to={`/property/${property.id}`}
      className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-text-main mb-2 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-primary font-bold text-xl mb-3">
          {formatPrice(property.price)} FCFA{priceSuffix}
        </p>
        <p className="text-text-muted text-sm mb-4 flex items-center gap-1">
          <MapPin size={14} />
          {property.address || property.city?.name || 'Localisation'}
        </p>
        <div className="flex items-center gap-4 text-sm text-text-muted pt-4 border-t border-border">
          <span>{property.bedrooms || '-'} ch.</span>
          <span>•</span>
          <span>{property.bathrooms || '-'} sdb</span>
          <span>•</span>
          <span>{property.surfaceM2 || '-'} m²</span>
        </div>
      </div>
    </Link>
  );
}
