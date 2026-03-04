import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ImageGallery({ images = [], title }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const displayImages = images.length > 0 ? images : ['https://picsum.photos/500/300?random'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px]">
          {/* Image principale */}
          <div 
            className="lg:col-span-3 relative rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setShowImageModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setShowImageModal(true)}
            aria-label="Ouvrir la galerie d'images"
          >
            <img
              src={displayImages[currentImageIndex]}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Image précédente"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Image suivante"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          </div>

          {/* Miniatures */}
          <div className="hidden lg:flex flex-col gap-4">
            {displayImages.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className="relative h-full rounded-xl overflow-hidden cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setCurrentImageIndex(idx)}
                aria-label={`Image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${title} - Miniature ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {idx === 2 && displayImages.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                    +{displayImages.length - 3} photos
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal galerie */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fermer la galerie"
          >
            <X size={32} />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Image précédente"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Image suivante"
          >
            <ChevronRight size={40} />
          </button>
          <img
            src={displayImages[currentImageIndex]}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
