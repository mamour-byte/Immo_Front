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
      <div className="mb-6 sm:mb-8">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-4 lg:h-[500px]">
          {/* Image principale */}
          <div 
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg sm:rounded-xl lg:col-span-3 lg:h-full lg:aspect-auto"
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
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 sm:p-2 rounded-full hover:bg-white transition-colors touch-manipulation"
              aria-label="Image précédente"
            >
              <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 sm:p-2 rounded-full hover:bg-white transition-colors touch-manipulation"
              aria-label="Image suivante"
            >
              <ChevronRight size={22} className="sm:w-6 sm:h-6" />
            </button>
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/70 text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          </div>

          {/* Miniatures */}
          <div className="hidden lg:flex flex-col gap-4">
            {displayImages.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className="group relative min-h-28 flex-1 cursor-pointer overflow-hidden rounded-xl"
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
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white p-3 sm:p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation"
            aria-label="Fermer la galerie"
          >
            <X size={28} className="sm:w-8 sm:h-8" />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white p-3 sm:p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation"
            aria-label="Image précédente"
          >
            <ChevronLeft size={32} className="sm:w-10 sm:h-10" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white p-3 sm:p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation"
            aria-label="Image suivante"
          >
            <ChevronRight size={32} className="sm:w-10 sm:h-10" />
          </button>
          <img
            src={displayImages[currentImageIndex]}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="max-h-[85vh] sm:max-h-[90vh] max-w-[95vw] sm:max-w-[90vw] object-contain"
          />
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 text-white text-sm sm:text-lg">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
