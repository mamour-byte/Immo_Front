import { useState } from 'react';

/**
 * Hook pour optimiser les images avec fallback et lazy loading
 */
export function useOptimizedImage(src, fallback = 'https://picsum.photos/500/300?random') {
  const [imageSrc, setImageSrc] = useState(src || fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setImageSrc(fallback);
    setIsLoading(false);
  };

  return {
    imageSrc,
    isLoading,
    error,
    onLoad: handleLoadingComplete,
    onError: handleError,
  };
}

/**
 * Hook pour gérer la pagination des images
 */
export function useImagePagination(totalImages = 1) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => 
      prev === totalImages - 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? totalImages - 1 : prev - 1
    );
  };

  const goTo = (index) => {
    if (index >= 0 && index < totalImages) {
      setCurrentIndex(index);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
  };

  return {
    currentIndex,
    next,
    prev,
    goTo,
    reset,
    hasNext: currentIndex < totalImages - 1,
    hasPrev: currentIndex > 0,
    totalImages,
  };
}

/**
 * Hook pour gérer le favorite d'une propriété
 */
export function useFavorite(propertyId, initialState = false) {
  const [isFavorite, setIsFavorite] = useState(() => {
    // Charger depuis localStorage si disponible
    const saved = localStorage.getItem(`favorite_${propertyId}`);
    return saved ? JSON.parse(saved) : initialState;
  });

  const toggle = () => {
    setIsFavorite((prev) => {
      const newState = !prev;
      localStorage.setItem(`favorite_${propertyId}`, JSON.stringify(newState));
      return newState;
    });
  };

  const set = (value) => {
    setIsFavorite(value);
    localStorage.setItem(`favorite_${propertyId}`, JSON.stringify(value));
  };

  return {
    isFavorite,
    toggle,
    set,
  };
}

/**
 * Hook pour gérer le state des tabs
 */
export function useTabs(initialTab = 'description') {
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('activePropertyTab');
    return saved || initialTab;
  });

  const selectTab = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem('activePropertyTab', tabName);
  };

  return {
    activeTab,
    selectTab,
  };
}
