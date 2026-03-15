import { useState, useEffect } from 'react';
import { API_URL } from '../../services/http';

export function usePropertyFetch(propertyId) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/properties/${propertyId}`, {
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000), // 10 secondes timeout
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Cette propriété n\'existe pas ou a été supprimée.');
          } else if (response.status === 500) {
            throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
          } else {
            throw new Error('Erreur lors de la récupération de la propriété.');
          }
        }

        const data = await response.json();
        setProperty(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('La requête a dépassé le délai d\'attente. Veuillez réessayer.');
        } else {
          setError(err.message || 'Erreur de connexion réseau');
        }
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  return { property, loading, error };
}

export function useSimilarProperties(cityId, propertyId) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cityId) return;

    const fetchSimilarProperties = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${API_URL}/properties?cityId=${cityId}`, {
          signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des propriétés similaires');
        }

        const data = await response.json();
        const items = data.items || data;
        const filtered = (items || []).filter(p => p.id !== propertyId);
        
        setProperties(filtered);
      } catch (err) {
        console.warn('Erreur lors de la récupération des propriétés similaires:', err.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [cityId, propertyId]);

  return { properties, loading };
}
