import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="bg-white rounded-lg p-8 max-w-md text-center shadow-lg">
            <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-text-main mb-2">Une erreur est survenue</h2>
            <p className="text-text-muted mb-6">
              Nous nous excusons. Veuillez rafraîchir la page ou réessayer ultérieurement.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
