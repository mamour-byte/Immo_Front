import { useRef, useState } from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { showError, showSuccess } from '../utils/notifications';
import { API_URL } from '../../services/http';
import { getWhatsAppMessage } from '../utils/helpers';

const CENTRAL_PHONE_DISPLAY = '+221 77 856 98 23';
const CENTRAL_WHATSAPP = '221778569823';
const DEFAULT_MESSAGE = 'Je suis intéressé par ce bien. Pouvez-vous me contacter ?';

export default function ContactForm({ property }) {
  const formRef = useRef(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: DEFAULT_MESSAGE,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsAppLoading, setWhatsAppLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function sendRequest(channel) {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...contactForm,
        channel,
        propertyId: property.id,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || data.message || 'Une erreur est survenue');
    }
    return data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await sendRequest('EMAIL');
      setSubmitSuccess(true);
      showSuccess('Demande envoyée avec succès !');
      setContactForm({ name: '', email: '', phone: '', message: DEFAULT_MESSAGE });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      const errorMsg = error.message || 'Erreur de connexion. Veuillez réessayer.';
      setSubmitError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = async () => {
    if (!formRef.current?.reportValidity()) return;

    setWhatsAppLoading(true);
    setSubmitError(null);

    try {
      await sendRequest('WHATSAPP');
      const message = encodeURIComponent(
        [
          getWhatsAppMessage(property),
          '',
          `Nom: ${contactForm.name}`,
          `Email: ${contactForm.email}`,
          `Téléphone: ${contactForm.phone || 'Non renseigné'}`,
          '',
          contactForm.message,
        ].join('\n'),
      );
      window.open(`https://wa.me/${CENTRAL_WHATSAPP}?text=${message}`, '_blank');
      showSuccess('Demande enregistrée. WhatsApp va s’ouvrir.');
    } catch (error) {
      const errorMsg = error.message || 'Impossible de préparer la demande WhatsApp.';
      setSubmitError(errorMsg);
      showError(errorMsg);
    } finally {
      setWhatsAppLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-4 sm:p-6 lg:sticky lg:top-24 lg:mt-10">
      <h3 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">Demander ce bien</h3>
      <p className="mb-5 text-sm leading-relaxed text-slate-600">
        Votre demande est transmise directement à Ethic Immobilier. Toutes les réponses passent par notre équipe.
      </p>

      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-900">Contact central</p>
        <a href={`tel:${CENTRAL_WHATSAPP}`} className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-600">
          <Phone size={16} />
          {CENTRAL_PHONE_DISPLAY}
        </a>
      </div>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Votre nom"
          required
          value={contactForm.name}
          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="email"
          placeholder="Votre email"
          required
          value={contactForm.email}
          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="tel"
          placeholder="Votre téléphone"
          value={contactForm.phone}
          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <textarea
          rows="4"
          placeholder="Votre message"
          required
          value={contactForm.message}
          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
          className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-rose-500"
        />

        {submitSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Demande envoyée avec succès !
          </div>
        )}

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Mail size={18} />
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
        </button>

        <button
          onClick={handleWhatsApp}
          type="button"
          disabled={whatsAppLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MessageCircle size={20} />
          {whatsAppLoading ? 'Préparation...' : 'Envoyer via WhatsApp'}
        </button>
      </form>
    </div>
  );
}
