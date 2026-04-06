import { useState } from 'react';
import { Check, MapPin, Navigation, ExternalLink, Eye } from 'lucide-react';
import Property3DViewer from '../../../components/Property3DViewer';

export default function PropertyTabs({ property }) {
  const [activeTab, setActiveTab] = useState('description');
  const features = property.features?.map(f => f.feature?.name) || [];

  // Fonction pour générer le lien d'itinéraire
  const getDirectionsUrl = () => {
    const destination = `${property.latitude},${property.longitude}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        {['description', 'features', 'location', ...(property.visits3D?.length > 0 ? ['3d-tour'] : [])].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-6 font-semibold text-sm transition-all relative ${
              activeTab === tab
                ? 'text-rose-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'description' && 'Description'}
            {tab === 'features' && 'Équipements'}
            {tab === 'location' && 'Localisation'}
            {tab === '3d-tour' && 'Visite 3D'}
            
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {property.description || 'Description non disponible'}
            </p>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.length === 0 ? (
              <span className="text-slate-400 text-sm italic">Aucun équipement renseigné.</span>
            ) : (
              features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                    <Check size={14} className="text-rose-600" />
                  </div>
                  <span className="text-slate-700 text-sm font-medium">{feature}</span>
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
                <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner group">
                  <iframe
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    /* Note: On centre sur la latitude/longitude */
                    src={`https://api.maptiler.com/maps/base-v4/?key=${
                    import.meta.env.VITE_MAPTILER_API_KEY || "get_your_own_OpIi9ZULNHzrESv6T2vL"
                  }#15/${property.latitude}/${property.longitude}`}

                  title="Localisation du bien"
                  />
                  {/* Custom Marker Overlay - Centré exactement */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative flex flex-col items-center">
                      <div className="bg-rose-600 p-2 rounded-full shadow-lg text-white animate-bounce">
                        <MapPin size={24} fill="currentColor" />
                      </div>
                      <div className="w-2 h-2 bg-slate-900/20 rounded-full blur-[2px] mt-1" />
                    </div>
                  </div>
                </div>

                {/* UX Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <MapPin size={20} className="text-rose-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Adresse du bien</p>
                      <p className="text-sm font-medium">{property.address || property.city?.name}</p>
                    </div>
                  </div>
                  
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg transition-all font-semibold text-sm shadow-sm active:scale-95"
                  >
                    <Navigation size={18} />
                    Itinéraire via Google Maps
                  </a>
                </div>
              </>
            ) : (
              <div className="bg-slate-100 rounded-xl h-60 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                <MapPin size={40} className="text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium">Localisation non disponible</p>
              </div>
            )}
          </div>
        )}

        {/* 3D Tour Tab */}
        {activeTab === '3d-tour' && (
          <div className="space-y-6">
            {property.visits3D?.length > 0 ? (
              property.visits3D.map((asset, index) => (
                <Property3DViewer key={asset.id || index} asset={asset} />
              ))
            ) : (
              <div className="bg-slate-100 rounded-xl h-60 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                <Eye size={40} className="text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium">Aucune visite 3D disponible</p>
                <p className="text-sm text-slate-400 mt-1">Contactez l'agent pour plus d'informations</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}