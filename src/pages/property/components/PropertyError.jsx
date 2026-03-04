import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function PropertyError({ error }) {
  const isNotFound = error && error.includes('existe pas');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-amber-500" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isNotFound ? 'Propriété non trouvée' : 'Une erreur est survenue'}
        </h2>
        <p className="text-slate-600 mb-6">
          {error || 'Impossible de charger les détails de cette propriété. Veuillez réessayer.'}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Réessayer
          </button>
          <Link
            to="/search"
            className="block w-full border-2 border-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            Retour à la recherche
          </Link>
        </div>
      </div>
    </div>
  );
}
