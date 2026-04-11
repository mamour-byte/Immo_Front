import { useState } from 'react';
import { Upload, Link, Eye, X } from 'lucide-react';

export default function Simple3DManager({ propertyId, assets3D = [], onUpdate }) {
  const [mode, setMode] = useState('url'); // 'url' ou 'file'
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const isMatterportUrl = url.trim().toLowerCase().includes('matterport.com');

  const handleUrlSubmit = async () => {
    if (!url.trim() || !title.trim() || !isMatterportUrl) return;

    try {
      const response = await fetch('/api/assets3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: parseInt(propertyId),
          title: title.trim(),
          provider: 'matterport',
          assetUrl: url.trim(),
        }),
      });

      if (response.ok) {
        const newAsset = await response.json();
        onUpdate([...assets3D, newAsset]);
        setUrl('');
        setTitle('');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || !title.trim()) return;

    // Verification taille (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('Fichier trop volumineux (max 10MB)');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('propertyId', propertyId);
    formData.append('title', title.trim());
    formData.append('provider', 'glb');

    try {
      const response = await fetch('/api/assets3d/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newAsset = await response.json();
        onUpdate([...assets3D, newAsset]);
        setTitle('');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAsset = async (assetId) => {
    try {
      await fetch(`/api/assets3d/${assetId}`, { method: 'DELETE' });
      onUpdate(assets3D.filter(a => a.id !== assetId));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('url')}
          className={`px-4 py-2 rounded-lg ${mode === 'url' ? 'bg-rose-500 text-white' : 'bg-gray-100'}`}
        >
          <Link className="w-4 h-4 inline mr-2" />
          URL externe
        </button>
        <button
          onClick={() => setMode('file')}
          className={`px-4 py-2 rounded-lg ${mode === 'file' ? 'bg-rose-500 text-white' : 'bg-gray-100'}`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Fichier GLB
        </button>
      </div>

      {mode === 'url' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre de la visite</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Visite complete appartement"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">URL de la visite 3D</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://my.matterport.com/show/?m=..."
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Support: Matterport uniquement
            </p>
            {url.trim() && !isMatterportUrl && (
              <p className="text-xs text-red-600 mt-1">
                Merci de renseigner une URL Matterport valide.
              </p>
            )}
          </div>
          <button
            onClick={handleUrlSubmit}
            disabled={!url.trim() || !title.trim() || !isMatterportUrl}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg disabled:opacity-50"
          >
            Ajouter visite
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre de la visite</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Modele 3D cuisine"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fichier GLB (max 10MB)</label>
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              disabled={isUploading}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {isUploading && <p className="text-sm text-blue-600 mt-1">Televersement en cours...</p>}
          </div>
        </div>
      )}

      {assets3D.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Visites 3D ({assets3D.length})</h3>
          {assets3D.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{asset.title}</p>
                  <p className="text-sm text-gray-500 capitalize">{asset.provider}</p>
                </div>
              </div>
              <button
                onClick={() => removeAsset(asset.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
