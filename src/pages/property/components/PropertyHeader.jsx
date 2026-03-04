import { MapPin, Share2, Heart } from 'lucide-react';

export default function PropertyHeader({ property, isFavorite, onFavoriteToggle, onShare }) {
  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-rose-50 text-rose-500 px-3 py-1 rounded-full text-sm font-semibold">
              {property.status}
            </span>
            {property.isFeatured && (
              <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                À la une
              </span>
            )}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            {property.title}
          </h1>
          <p className="text-slate-600 flex items-center gap-2">
            <MapPin size={18} />
            {property.address || property.city?.name || 'Localisation non spécifiée'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onFavoriteToggle}
            className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
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
            className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Partager"
            aria-label="Partager ce bien"
          >
            <Share2 size={20} className="text-slate-600" />
          </button>
        </div>
      </div>
      <div className="text-3xl font-bold text-rose-500">
        {formatPrice(property.price)} FCFA
      </div>
    </div>
  );
}
