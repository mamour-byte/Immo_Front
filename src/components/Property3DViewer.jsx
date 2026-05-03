import { useEffect, useState } from 'react';
import { ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import GLBViewer from './GLBViewer';
import { getAsset3DViewerConfig } from '../utils/asset3d';

export default function Property3DViewer({ asset }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState(null);
  const { embedUrl, publicUrl, error } = getAsset3DViewerConfig(asset);
  const shouldRenderIframe = asset.provider !== 'glb' && Boolean(embedUrl);
  const isLoading = shouldRenderIframe && loadedSrc !== embedUrl;

  useEffect(() => {
    if (!embedUrl) return undefined;
    const timer = setTimeout(() => setLoadedSrc(embedUrl), 3500);
    return () => clearTimeout(timer);
  }, [embedUrl]);

  if (asset.provider === 'glb') {
    if (!asset.fileUrl) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          Fichier 3D manquant. Merci d&apos;ajouter un fichier .glb/.gltf valide pour cette visite.
        </div>
      );
    }

    return <GLBViewer asset={asset} />;
  }

  return (
    <div className={`relative min-w-0 bg-surface rounded-xl overflow-hidden border border-border ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex flex-col gap-3 p-4 bg-white border-b border-border sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-text-main wrap-break-word">{asset.title || 'Visite 3D'}</h3>
          <p className="text-sm text-text-muted capitalize">{asset.provider}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={publicUrl || asset.assetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-surface hover:bg-border text-text-main px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <ExternalLink size={16} />
            Ouvrir
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 bg-surface hover:bg-border text-text-main px-3 py-2 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      <div className={`relative ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[260px] sm:h-96'}`}>
        {!embedUrl ? (
          <div className="h-full flex items-center justify-center p-6 bg-amber-50 text-amber-900">
            <div className="max-w-lg text-center space-y-2">
              <p className="font-semibold">Cette visite 3D ne peut pas être intégrée telle quelle.</p>
              <p className="text-sm text-amber-800">{error}</p>
              <p className="text-sm text-amber-800">
                Vous pouvez tout de même l&apos;ouvrir dans un nouvel onglet avec le bouton ci-dessus.
              </p>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-text-muted">Chargement de la visite 3D...</p>
                </div>
              </div>
            )}

            <iframe
              key={embedUrl}
              src={embedUrl}
              className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              allowFullScreen
              allow="xr-spatial-tracking; gyroscope; accelerometer"
              onLoad={() => setLoadedSrc(embedUrl)}
              title={`Visite 3D - ${asset.title || 'Propriete'}`}
            />

            {!isLoading && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
                  Utilisez votre souris pour naviguer. Appuyez sur Echap pour quitter le plein ecran.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
