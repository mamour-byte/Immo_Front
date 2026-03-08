import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ property }) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 overflow-x-auto scrollbar-hide">
          <Link to="/" className="hover:text-slate-900 transition-colors flex-shrink-0">Accueil</Link>
          <ChevronRight size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
          <Link to="/search" className="hover:text-slate-900 transition-colors flex-shrink-0">Recherche</Link>
          <ChevronRight size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
          <span className="text-slate-900 font-medium truncate min-w-0">{property.title}</span>
        </nav>
      </div>
    </div>
  );
}
