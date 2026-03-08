import { MapPin, Share2, Heart } from 'lucide-react';

export default function PropertyHeader({ property, isFavorite, onFavoriteToggle, onShare }) {
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
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
      <div className="text-2xl sm:text-3xl font-bold text-rose-500 break-all">
        {formatPrice(property.price)} FCFA
      </div>
    </div>
  );
}
