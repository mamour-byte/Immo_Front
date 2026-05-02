import { MapPin, Share2, Heart } from 'lucide-react';

function getDaysAgo(dateString) {
  if (!dateString) return null;
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Il y a 1 jour";
  return `Il y a ${diffDays} jours`;
}

export default function PropertyHeader({ property, isFavorite, onFavoriteToggle, onShare }) {
  const purposeLabel =
    property?.purpose === "VENTE"
      ? "Vente"
      : property?.purpose === "LOCATION"
        ? property?.rentalMode === "DAILY"
          ? "Location journaliere"
          : "Location mensuelle"
        : null;
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
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <span className="bg-rose-50 text-rose-500 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
              {property.status}
            </span>
            {purposeLabel && (
              <span className="bg-white border border-slate-200 text-slate-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {purposeLabel}
              </span>
            )}
            {property.isFeatured && (
              <span className="bg-slate-900 text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                À la une
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-2 break-words">
            {property.title}
          </h1>
          <p className="text-slate-600 flex items-center gap-2 text-sm sm:text-base min-w-0">
            <MapPin size={16} className="flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
            <span className="truncate">{property.address || property.city?.name || 'Localisation non spécifiée'}</span>
          </p>
          {/* Date de publication */}
          {property.createdAt && (
            <p className="text-xs text-slate-400 mt-1">{getDaysAgo(property.createdAt)}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={onFavoriteToggle}
            className="p-2.5 sm:p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors touch-manipulation"
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-label="Ajouter aux favoris"
          >
            <Heart 
              size={20} 
              className={`${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
            />
          </button>
          <button 
            onClick={onShare}
            className="p-2.5 sm:p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors touch-manipulation"
            title="Partager"
            aria-label="Partager ce bien"
          >
            <Share2 size={20} className="text-slate-600" />
          </button>
        </div>
      </div>
      <div className="break-words text-2xl font-bold text-rose-500 sm:text-3xl">
        {formatPrice(property.price)} FCFA{priceSuffix}
      </div>
    </div>
  );
}
