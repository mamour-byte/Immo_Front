/**
 * Génère les métadonnées SEO pour une propriété
 */
export function generatePropertySEO(property) {
  const title = `${property.title} - ${property.price} FCFA | Ethic-Immo`;
  const description = property.description
    ? property.description.substring(0, 160)
    : `Découvrez ${property.title} à ${property.city?.name || 'Dakar'}. Voir les détails, photos et contacter l'agence.`;

  const keywords = [
    property.type,
    property.city?.name,
    property.district?.name,
    'immobilier',
    'bien',
    'à vendre',
  ].filter(Boolean).join(', ');

  const images = property.images?.length 
    ? property.images.map(img => img.url)
    : [];

  return {
    title,
    description,
    keywords,
    image: images[0] || 'https://via.placeholder.com/1200x630',
    images,
    url: `${window.location.origin}/property/${property.id}`,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.surfaceM2,
    price: property.price,
    priceCurrency: 'XOF',
    address: property.address,
    city: property.city?.name,
    latitude: property.latitude,
    longitude: property.longitude,
  };
}

/**
 * Génère le message WhatsApp personnalisé
 */
export function getWhatsAppMessage(property) {
  const propertyTitle = property.title || 'cette annonce';
  const propertyLocation = property.city?.name || property.district?.name || '';
  const propertyUrl = `${window.location.origin}/property/${property.id}`;
  
  return `Bonjour, j'ai vu votre annonce sur Ethic-Immo et je suis intéressé par ${propertyLocation ? `[${propertyLocation} : ${propertyTitle}]` : propertyTitle}. Le lien de cette annonce est : ${propertyUrl}`;
}

/**
 * Ouvre WhatsApp avec le message pré-rempli
 */
function normalizeWhatsAppNumber(value) {
  if (!value) return null;
  const digits = String(value).replace(/[^\d]/g, "");
  return digits.length ? digits : null;
}

export function openWhatsApp(property, phoneNumber = '221778569823') {
  const normalized = normalizeWhatsAppNumber(phoneNumber);
  if (!normalized) return;
  const message = encodeURIComponent(getWhatsAppMessage(property));
  window.open(`https://wa.me/${normalized}?text=${message}`, '_blank');
}

/**
 * Formatte le prix avec séparateurs
 */
export function formatPrice(price) {
  if (!price) return '0';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
