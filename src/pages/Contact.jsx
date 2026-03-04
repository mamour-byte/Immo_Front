import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle, 
  MessageSquare, User, Building2, Calendar
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    propertyType: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        propertyType: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-block bg-rose-500/20 text-rose-400 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Parlons de votre projet
            </h1>
            <p className="text-lg text-slate-300">
              Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre recherche immobilière.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          
          {/* Informations de contact */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Cards */}
            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Téléphone</h3>
              <a href="tel:+221770000000" className="text-slate-600 hover:text-rose-500 transition-colors">
                +221 78 147 90 90
              </a>
              <p className="text-sm text-slate-500 mt-1">Lun - Sam: 8h - 18h</p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Email</h3>
              <a href="mailto:contact@ethic.com" className="text-slate-600 hover:text-rose-500 transition-colors">
                immo@ethic-group.com
              </a>
              <p className="text-sm text-slate-500 mt-1">Réponse sous 24h</p>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Adresse</h3>
              <p className="text-slate-600">
                Avenue Léopold Sédar Senghor<br />
                Dakar, Sénégal
              </p>
              <a href="#map" className="text-sm text-rose-500 hover:text-rose-700 mt-2 inline-block">
                Voir sur la carte →
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Horaires</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Lundi - Vendredi</span>
                  <span className="font-medium">8h - 18h</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Samedi</span>
                  <span className="font-medium">9h - 14h</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dimanche</span>
                  <span className="font-medium">Fermé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Envoyez-nous un message
                </h2>
                <p className="text-slate-600">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center animate-fadeIn">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-slate-600">
                    Nous avons bien reçu votre message et vous répondrons rapidement.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Nom et Prénom */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Prénom *
                      </label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                          placeholder="Aliou"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Nom *
                      </label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                          placeholder="Ndiaye"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email et Téléphone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                          placeholder="aliou.ndiaye@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Téléphone *
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                          placeholder="+221 77 123 45 67"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sujet et Type de bien */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Sujet *
                      </label>
                      <div className="relative">
                        <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Choisir un sujet</option>
                          <option value="achat">Achat de bien</option>
                          <option value="vente">Vendre mon bien</option>
                          <option value="location">Location</option>
                          <option value="estimation">Estimation</option>
                          <option value="gestion">Gestion immobilière</option>
                          <option value="autre">Autre demande</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Type de bien
                      </label>
                      <div className="relative">
                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Tous les types</option>
                          <option value="appartement">Appartement</option>
                          <option value="maison">Maison</option>
                          <option value="terrain">Terrain</option>
                          <option value="bureau">Bureau</option>
                          <option value="commerce">Commerce</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                      placeholder="Décrivez votre projet ou votre demande..."
                    />
                  </div>

                  {/* Bouton submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>

                  <p className="text-sm text-slate-500 text-center">
                    * Champs obligatoires
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Section Rendez-vous */}
        <div className="bg-slate-900 rounded-2xl p-8 lg:p-12 text-white mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-rose-500/20 text-rose-400 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                Prendre rendez-vous
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Visitez notre agence
              </h2>
              <p className="text-slate-300 mb-6">
                Rencontrez nos experts en personne pour discuter de votre projet immobilier. Nous sommes disponibles du lundi au samedi pour vous recevoir dans nos bureaux.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Réservation facile</p>
                    <p className="text-sm text-slate-400">En ligne ou par téléphone</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Conseil personnalisé</p>
                    <p className="text-sm text-slate-400">Un expert dédié à votre projet</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Sans engagement</p>
                    <p className="text-sm text-slate-400">Consultation gratuite</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <a
                href="tel:+221770000000"
                className="inline-block bg-rose-500 hover:bg-rose-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Réserver un rendez-vous
              </a>
            </div>
          </div>
        </div>

        {/* Carte */}
        <div id="map" className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-200 h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Carte interactive (Google Maps API)</p>
              <p className="text-sm text-slate-400 mt-2">Avenue Léopold Sédar Senghor, Dakar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}