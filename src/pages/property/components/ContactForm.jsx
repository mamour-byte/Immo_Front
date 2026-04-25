import { useState } from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { showError, showSuccess } from '../utils/notifications';
import { API_URL } from '../../services/http';

export default function ContactForm({ property, onWhatsAppClick }) {
  const agent = property?.agent;
  const agentProfile = agent?.agentProfile;
  const agentName = agent?.fullName || 'Agent';
  const agentCompany = agentProfile?.companyName;
  const agentAvatarUrl = agentProfile?.avatarUrl;
  const hasWhatsApp = Boolean(agentProfile?.whatsapp || agent?.phone);

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
      const response = await fetch(`${API_URL}/contact`, {
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
    <div className="rounded-xl bg-white p-4 sm:p-6 lg:sticky lg:top-24 lg:mt-10">
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Contactez l'agent</h3>

      <div className="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-200 p-3 mb-6">
        {agentAvatarUrl ? (
          <img
            src={agentAvatarUrl}
            alt={agentName}
            className="h-12 w-12 rounded-full object-cover border border-slate-200"
            loading="lazy"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
            {(agentName || "A").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 truncate">{agent ? agentName : "Agent non renseignÃ©"}</p>
          <p className="text-sm text-slate-600 truncate">{agentCompany || (agent?.email ? agent.email : "")}</p>
        </div>
      </div>
      
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
          type="button"
          disabled={!hasWhatsApp}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle size={20} />
          Contacter via WhatsApp
        </button>
        {!hasWhatsApp && (
          <p className="text-xs text-slate-500 text-center">WhatsApp non disponible pour ce bien.</p>
        )}
      </div>

      {/* Agent info */}
      <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
        {agent ? (
          <>
            {agent.phone && (
              <a 
                href={`tel:${agent.phone}`} 
                className="flex items-center justify-center gap-2 w-full bg-rose-50 text-rose-500 py-3 rounded-lg font-semibold hover:bg-rose-100 transition-colors"
              >
                <Phone size={18} />
                Appeler
              </a>
            )}
            {agent.email && (
              <a 
                href={`mailto:${agent.email}`} 
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
