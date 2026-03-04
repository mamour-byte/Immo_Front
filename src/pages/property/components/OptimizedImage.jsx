import { useState } from 'react';

/**
 * Composant Image optimisé avec lazy loading, fallback et gestion d'erreur
 */
export default function OptimizedImage({ 
  src, 
  alt = '', 
  className = '',
  fallback = 'https://picsum.photos/500/300?random',
  onLoad = () => {},
  onError = () => {},
  ...props 
}) {
  const [imageSrc, setImageSrc] = useState(src || fallback);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = (e) => {
    setIsLoading(false);
    onLoad(e);
  };

  const handleError = (e) => {
    console.warn(`Image failed to load: ${imageSrc}`);
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
    onError(e);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Skeleton loading */}
      {isLoading && (
        <div className={`${className} bg-slate-200 animate-pulse absolute inset-0`} />
      )}

      {/* Actual image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}
