import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Composants
import Breadcrumb from './components/Breadcrumb';
import PropertyHeader from './components/PropertyHeader';
import ImageGallery from './components/ImageGallery';
import PropertyCharacteristics from './components/PropertyCharacteristics';
import PropertyTabs from './components/PropertyTabs';
import ContactForm from './components/ContactForm';
import SimilarProperties from './components/SimilarProperties';
import PropertyError from './components/PropertyError';
import PropertyLoading from './components/PropertyLoading';
import ErrorBoundary from './components/ErrorBoundary';

// Hooks et utilitaires
import { usePropertyFetch, useSimilarProperties } from './hooks/useProperty';
import { generatePropertySEO, openWhatsApp } from './utils/helpers';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { property, loading, error } = usePropertyFetch(id);
  const { properties: similarProperties } = useSimilarProperties(property?.city?.id, id);
  const [isFavorite, setIsFavorite] = useState(false);

  if (loading) return <PropertyLoading />;
  if (error || !property) return <PropertyError error={error} />;

  const seoData = generatePropertySEO(property);
  const images = property.images?.length 
    ? property.images.map(i => i.url) 
    : ['https://picsum.photos/500/300?random'];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Découvrez ${property.title} à ${property.city?.name || 'Dakar'}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <ErrorBoundary>
      <Helmet>
        {/* Métadonnées de base */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        
        {/* Open Graph pour les réseaux sociaux */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:site_name" content="Ethic-Immo" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.image} />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateProperty',
            'name': property.title,
            'description': property.description,
            'image': seoData.images,
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': property.address,
              'addressLocality': property.city?.name,
              'addressCountry': 'SN',
            },
            'price': {
              '@type': 'PriceSpecification',
              'priceCurrency': 'XOF',
              'price': property.price,
            },
            'numberOfBedrooms': property.bedrooms,
            'numberOfBathroomsUnitsFull': property.bathrooms,
            'floorSize': {
              '@type': 'QuantitativeValue',
              'unitCode': 'MTK',
              'value': property.surfaceM2,
            },
            'latitude': property.latitude,
            'longitude': property.longitude,
          })}
        </script>

        {/* Canonical URL */}
        <link rel="canonical" href={seoData.url} />
        
        {/* Viewport et charset */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <Breadcrumb property={property} />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <PropertyHeader 
            property={property} 
            isFavorite={isFavorite}
            onFavoriteToggle={() => setIsFavorite(!isFavorite)}
            onShare={handleShare}
          />

          {/* Image Gallery */}
          <ImageGallery 
            images={images}
            title={property.title}
          />

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8 mt-20">
              {/* Characteristics */}
              <PropertyCharacteristics property={property} />

              {/* Tabs */}
              <PropertyTabs property={property} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6 mt-20">
              <ContactForm 
                property={property}
                onWhatsAppClick={() => openWhatsApp(property)}
              />
            </div>
          </div>

          {/* Similar Properties */}
          <SimilarProperties properties={similarProperties} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
