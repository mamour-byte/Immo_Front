import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ property }) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Link to="/" className="hover:text-slate-900 transition-colors">Accueil</Link>
          <ChevronRight size={16} />
          <Link to="/search" className="hover:text-slate-900 transition-colors">Recherche</Link>
          <ChevronRight size={16} />
          <span className="text-slate-900 font-medium">{property.title}</span>
        </div>
      </div>
    </div>
  );
}
