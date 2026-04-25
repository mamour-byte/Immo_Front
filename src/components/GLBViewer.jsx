import { useState, useEffect, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';

// GLB Model Loader Component
function Model({ url, onLoad }) {
  const gltf = useGLTF(url);

  const scene = useMemo(() => {
    if (!gltf?.scene) return null;
    const clonedScene = gltf.scene.clone(true);

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    clonedScene.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 2 / maxDim : 1;
    clonedScene.scale.setScalar(scale);

    return clonedScene;
  }, [gltf]);

  useEffect(() => {
    if (scene) {
      onLoad?.();
    }
  }, [scene, onLoad]);

  return scene ? <primitive object={scene} /> : null;
}

// Loading fallback component
function Loader() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    </Html>
  );
}

// Error fallback component
function ErrorFallback({ onRetry }) {
  return (
    <Html center>
      <div className="text-center text-red-500">
        <p className="mb-4">Erreur de chargement du modèle 3D</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
        >
          Réessayer
        </button>
      </div>
    </Html>
  );
}

export default function GLBViewer({ asset }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0); // For forcing re-render on retry
  const isWebGLSupported = useMemo(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return true;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return Boolean(gl);
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setKey(prev => prev + 1); // Force re-render
  };

  const resetCamera = () => {
    // This will be handled by OrbitControls reset
    window.dispatchEvent(new CustomEvent('resetCamera'));
  };

  return (
    <div className={`relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div>
          <h3 className="font-semibold text-slate-900">{asset.title || 'Modèle 3D'}</h3>
          <p className="text-sm text-slate-500">Fichier GLB/GLTF</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetCamera}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
            title="Réinitialiser la caméra"
          >
            <RotateCcw size={16} />
          </button>

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
        {!isWebGLSupported && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 p-6">
            <div className="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-amber-900">
              <p className="font-semibold">WebGL non supporte sur ce navigateur.</p>
              <p className="mt-2 text-sm">
                La visite 3D locale n&apos;est pas disponible ici. Ouvrez-la sur un navigateur compatible ou dans un nouvel onglet.
              </p>
              {asset.fileUrl && (
                <a
                  href={asset.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  Ouvrir le fichier 3D
                </a>
              )}
            </div>
          </div>
        )}

        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Chargement du modèle 3D...</p>
            </div>
          </div>
        )}

        {isWebGLSupported && (
          <Canvas
            key={key}
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ background: '#f8fafc' }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={<Loader />}>
              {/* Lighting */}
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />

              {/* Environment for reflections */}
              <Environment preset="studio" />

              {/* Controls */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxDistance={10}
                minDistance={1}
              />

              {/* Model */}
              {!hasError && (
                <Model
                  url={asset.fileUrl}
                  onLoad={handleLoad}
                />
              )}

              {/* Error display */}
              {hasError && <ErrorFallback onRetry={handleRetry} />}
            </Suspense>
          </Canvas>
        )}

        {!isLoading && !hasError && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
              💡 Utilisez la souris pour naviguer • Molette pour zoomer • Clic droit pour pivoter
            </div>
          </div>
        )}
      </div>
    </div>
  );
}