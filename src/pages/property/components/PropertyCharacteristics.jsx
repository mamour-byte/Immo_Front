import { Bed, Bath, Maximize, Home, Calendar } from 'lucide-react';
import FeatureItem from './FeatureItem';

export default function PropertyCharacteristics({ property }) {
  return (
    <div className="bg-white rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Caractéristiques</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <FeatureItem icon={<Bed size={24} />} label="Chambres" value={property.bedrooms} />
        <FeatureItem icon={<Bath size={24} />} label="Salles de bain" value={property.bathrooms} />
        <FeatureItem icon={<Maximize size={24} />} label="Surface" value={property.surfaceM2 ? `${property.surfaceM2} m²` : '-'} />
        <FeatureItem icon={<Home size={24} />} label="Type" value={property.type} />
        <FeatureItem icon={<Calendar size={24} />} label="Créé le" value={property.createdAt ? new Date(property.createdAt).getFullYear() : '-'} />
      </div>
    </div>
  );
}
