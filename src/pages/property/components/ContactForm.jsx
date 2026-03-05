import { useState } from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { showError, showSuccess } from '../utils/notifications';

export default function ContactForm({ property, onWhatsAppClick }) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'Je suis intéressé par ce bien. Pouvez-vous me contacter ?'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch('https://immo-backend-b2x5.onrender.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactForm,
          propertyId: property.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      if (data.success || response.ok) {
        setSubmitSuccess(true);
        showSuccess('Message envoyé avec succès !');
        setContactForm({
          name: '',
          email: '',
          phone: '',
          message: 'Je suis intéressé par ce bien. Pouvez-vous me contacter ?'
        });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        throw new Error(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      const errorMsg = error.message || 'Erreur de connexion. Veuillez réessayer.';
      setSubmitError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl mt-10 p-6 top-24 sticky">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Contactez l'agence</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Votre nom" 
          required
          value={contactForm.name}
          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all" 
        />
        <input 
          type="email" 
          placeholder="Votre email" 
          required
          value={contactForm.email}
          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all" 
        />
        <input 
          type="tel" 
          placeholder="Votre téléphone" 
          value={contactForm.phone}
          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all" 
        />
        <textarea 
          rows="4" 
          placeholder="Votre message" 
          required
          value={contactForm.message}
          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none transition-all" 
        />

        {submitSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <span>✓</span> Message envoyé avec succès !
          </div>
        )}

        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
      </form>

      {/* Boutons WhatsApp */}
      <div className="mt-4 space-y-3">
        <button
          onClick={onWhatsAppClick}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          Contacter via WhatsApp
        </button>
      </div>

      {/* Agent info */}
      <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
        {property.agent ? (
          <>
            {property.agent.phone && (
              <a 
                href={`tel:${property.agent.phone}`} 
                className="flex items-center justify-center gap-2 w-full bg-rose-50 text-rose-500 py-3 rounded-lg font-semibold hover:bg-rose-100 transition-colors"
              >
                <Phone size={18} />
                Appeler
              </a>
            )}
            {property.agent.email && (
              <a 
                href={`mailto:${property.agent.email}`} 
                className="flex items-center justify-center gap-2 w-full border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                <Mail size={18} />
                Email
              </a>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-500 text-center">Informations d'agent non disponibles</p>
        )}
      </div>
    </div>
  );
}
