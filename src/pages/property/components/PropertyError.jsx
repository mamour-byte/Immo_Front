import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function PropertyError({ error }) {
  const isNotFound = error && error.includes('existe pas');

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-amber-500" />
        <h2 className="text-2xl font-bold text-text-main mb-2">
          {isNotFound ? 'Propriété non trouvée' : 'Une erreur est survenue'}
        </h2>
        <p className="text-text-muted mb-6">
          {error || 'Impossible de charger les détails de cette propriété. Veuillez réessayer.'}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-dark text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Réessayer
          </button>
          <Link
            to="/search"
            className="block w-full border-2 border-border text-text-main py-3 rounded-lg font-semibold hover:bg-surface transition-colors"
          >
            Retour à la recherche
          </Link>
        </div>
      </div>
    </div>
  );
}
