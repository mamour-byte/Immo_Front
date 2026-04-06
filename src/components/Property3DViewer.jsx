import { useState, useEffect } from 'react';
import { ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import GLBViewer from './GLBViewer';

export default function Property3DViewer({ asset }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement pour les iframes
    if (asset.provider !== 'glb') {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    } else {
      // Pour GLB, le chargement est géré par GLBViewer
      setIsLoading(false);
    }
  }, [asset.provider]);

  // If it's a GLB file, use the GLBViewer
  if (asset.provider === 'glb') {
    if (!asset.fileUrl) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          Fichier 3D manquant. Merci d'ajouter un fichier .glb/.gltf valide pour cette visite.
        </div>
      );
    }
    return <GLBViewer asset={asset} />;
  }

  const getEmbedUrl = (asset) => {
    const { provider, assetUrl } = asset;

    switch (provider.toLowerCase()) {
      case 'matterport':
        // Matterport embed URL
        return assetUrl.replace('/show/?m=', '/show/?play=1&m=');

      case 'sketchfab':
        // Sketchfab embed URL
        const sketchfabId = assetUrl.split('/').pop();
        return `https://sketchfab.com/models/${sketchfabId}/embed`;

      case 'kuula':
        // Kuula embed URL
        return assetUrl.replace('/v/', '/embed/');

      case 'iframe':
      default:
        return assetUrl;
    }
  };

  const embedUrl = getEmbedUrl(asset);

  return (
    <div className={`relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div>
          <h3 className="font-semibold text-slate-900">{asset.title || 'Visite 3D'}</h3>
          <p className="text-sm text-slate-500 capitalize">{asset.provider}</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={asset.assetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <ExternalLink size={16} />
            Ouvrir
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className={`relative ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-96'}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Chargement de la visite 3D...</p>
            </div>
          </div>
        )}

        <iframe
          src={embedUrl}
          className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          allowFullScreen
          allow="xr-spatial-tracking; gyroscope; accelerometer"
          onLoad={() => setIsLoading(false)}
          title={`Visite 3D - ${asset.title || 'Propriété'}`}
        />

        {!isLoading && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
              💡 Utilisez votre souris pour naviguer • Appuyez sur Échap pour quitter le plein écran
            </div>
          </div>
        )}
      </div>
    </div>
  );
}