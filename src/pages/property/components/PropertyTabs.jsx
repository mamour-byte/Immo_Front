import { useState } from 'react';
import { Check, MapPin, Navigation, Eye } from 'lucide-react';
import Property3DViewer from '../../../components/Property3DViewer';

export default function PropertyTabs({ property }) {
  const [activeTab, setActiveTab] = useState('description');
  const features = property.features?.map(f => f.feature?.name) || [];
  const mapTilerKey = import.meta.env.VITE_MAPTILER_API_KEY;

  // Fonction pour générer le lien d'itinéraire
  const getDirectionsUrl = () => {
    const destination = `${property.latitude},${property.longitude}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  const getMaptilerStaticUrl = () => {
    if (!property.latitude || !property.longitude || !mapTilerKey) return null;
    return `https://api.maptiler.com/maps/streets-v2/static/${property.longitude},${property.latitude},15/1200x640.png?key=${mapTilerKey}&markers=${property.longitude},${property.latitude},red`;
  };

  const maptilerStaticUrl = getMaptilerStaticUrl();
  const osmEmbedUrl = property.latitude && property.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01}%2C${property.latitude - 0.01}%2C${property.longitude + 0.01}%2C${property.latitude + 0.01}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-border bg-surface/50 scrollbar-hide">
        {['description', 'features', 'location', ...(property.visits3D?.length > 0 ? ['3d-tour'] : [])].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative shrink-0 px-4 py-4 text-sm font-semibold transition-all sm:flex-1 sm:px-6 ${
              activeTab === tab
                ? 'text-primary'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            {tab === 'description' && 'Description'}
            {tab === 'features' && 'Équipements'}
            {tab === 'location' && 'Localisation'}
            {tab === '3d-tour' && 'Visite 3D'}
            
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="prose prose-slate max-w-none">
            <p className="text-text-muted leading-relaxed whitespace-pre-wrap">
              {property.description || 'Description non disponible'}
            </p>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.length === 0 ? (
              <span className="text-text-muted text-sm italic">Aucun équipement renseigné.</span>
            ) : (
              features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
                  <div className="w-6 h-6 bg-secondary-light rounded-full flex items-center justify-center shrink-0">
                    <Check size={14} className="text-primary" />
                  </div>
                  <span className="text-text-main text-sm font-medium">{feature}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="space-y-4">
            {property.latitude && property.longitude ? (
              <>
                <div className="group relative overflow-hidden rounded-xl border border-border shadow-inner min-h-[320px]">
                  {maptilerStaticUrl ? (
                    <img
                      src={maptilerStaticUrl}
                      alt="Carte de localisation du bien"
                      className="h-[320px] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <iframe
                      width="100%"
                      height="320"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={osmEmbedUrl}
                      title="Localisation du bien"
                    />
                  )}
                  {/* Custom Marker Overlay - Centré exactement */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative flex flex-col items-center">
                      <div className="bg-primary p-2 rounded-full shadow-lg text-white animate-bounce">
                        <MapPin size={24} fill="currentColor" />
                      </div>
                      <div className="w-2 h-2 bg-primary-dark/20 rounded-full blur-[2px] mt-1" />
                    </div>
                  </div>
                </div>

                {/* UX Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-primary-dark text-white">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-dark rounded-lg">
                      <MapPin size={20} className="text-rose-400" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Adresse du bien</p>
                      <p className="text-sm font-medium">{property.address || property.city?.name}</p>
                    </div>
                  </div>
                  
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg transition-all font-semibold text-sm shadow-sm active:scale-95"
                  >
                    <Navigation size={18} />
                    Itinéraire via Google Maps
                  </a>
                </div>
              </>
            ) : (
              <div className="bg-surface rounded-xl h-60 flex flex-col items-center justify-center border-2 border-dashed border-border">
                <MapPin size={40} className="text-border mb-2" />
                <p className="text-text-muted font-medium">Localisation non disponible</p>
              </div>
            )}
          </div>
        )}

        {/* 3D Tour Tab */}
        {activeTab === '3d-tour' && (
          <div className="space-y-6 min-w-0 overflow-hidden">
            {property.visits3D?.length > 0 ? (
              property.visits3D.map((asset, index) => (
                <div key={asset.id || index} className="min-w-0 overflow-hidden">
                  <Property3DViewer asset={asset} />
                </div>
              ))
            ) : (
              <div className="bg-surface rounded-xl h-60 flex flex-col items-center justify-center border-2 border-dashed border-border">
                <Eye size={40} className="text-border mb-2" />
                <p className="text-text-muted font-medium">Aucune visite 3D disponible</p>
                <p className="text-sm text-text-muted mt-1">Contactez l'agent pour plus d'informations</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
