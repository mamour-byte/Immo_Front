import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HardHat, Ruler, Building2, Wrench, CheckCircle, 
  Phone, Mail, Globe, Users, Award, TrendingUp,
  Lightbulb, PenTool, Hammer, ArrowRight, Play,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';

export default function ConstructionPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Galerie de réalisations
  const projects = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
      title: 'Résidence a Thies ',
      category: 'residential',
      location: 'Grand Standing, Thies',
      year: '2018',
      description: 'Villa moderne R+2 '
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
      title: 'Plan BA ',
      category: 'Education',
      location: 'Don Bosco',
      year: '2023',
      description: 'Centre commercial de 5000m² avec 40 boutiques'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      title: 'Tour Atlantic',
      category: 'commercial',
      location: 'Mermoz, Dakar',
      year: '2022',
      description: 'Immeuble de bureaux R+8 avec parking souterrain'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      title: 'Villa contemporaine',
      category: 'residential',
      location: 'Ngor, Dakar',
      year: '2023',
      description: 'Villa moderne avec piscine et jardin paysager'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      title: 'Résidence Sérénité',
      category: 'residential',
      location: 'Saly, Thiès',
      year: '2022',
      description: 'Programme de 20 appartements face à la mer'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
      title: 'Siège social SARL Tech',
      category: 'commercial',
      location: 'Ouakam, Dakar',
      year: '2023',
      description: 'Bureaux modernes de 2000m² avec terrasse'
    }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  // Équipe
  const team = [
    {
      name: 'Thiendella Fall',
      role: 'Directeur Général CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
      experience: 'Ingénieur Civil '
    },
    {
      name: 'Hamoye Diop',
      role: 'Concepteur et réalisateur',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      experience: ''
    },
    {
      name: 'Mame Lobe Fall',
      role: 'Technicienne Supérieure',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
      experience: ''
    },
    {
      name: 'Mamour Fall',
      role: 'Manager Commercial',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5',
      experience: ''
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] lg:h-[70vh] flex items-center bg-slate-900 overflow-hidden py-12 sm:py-0">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
            alt="Ethic Construction"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl">
            <div className="inline-block bg-rose-500/20 text-rose-400 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4 sm:mb-6">
              Ethic Construction
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Bâtissons ensemble vos projets d'avenir
            </h1>
            <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-8">
              De l'étude à la réalisation, Ethic Construction vous accompagne dans tous vos projets immobiliers avec expertise et professionnalisme.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href="#contact"
                className="bg-rose-500 hover:bg-rose-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 touch-manipulation"
              >
                Demander un devis
                <ArrowRight size={20} className="w-5 h-5" />
              </a>
              <a
                href="#realisations"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 touch-manipulation"
              >
                Nos réalisations
                <Play size={20} className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
            <StatCard number="5" label="Années d'expérience" />
            <StatCard number="20+" label="Projets réalisés" />
            <StatCard number="5+" label="Collaborateurs" />
            <StatCard number="98%" label="Clients satisfaits" />
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="inline-block bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4 sm:mb-6">
                À propos
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
                Ethic Construction, votre partenaire bâtisseur
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Ethic, votre partenaire de confiance pour tous vos projets de construction. Basée à Dakar, notre entreprise accompagne particuliers, professionnels et institutions dans la conception de plans de construction jusqu’à la réalisation complète de leurs ouvrages. 
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Fondée par Thiendella Fall, ingénieur en génie civil, Ethic s’appuie sur une équipe jeune, dynamique et talentueuse pour concrétiser vos idées avec rigueur et innovation.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Certifié </p>
                    <p className="text-sm text-slate-500">Qualité garantie</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <img
                src="https://ethic-group.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-29-a-23.50.31_820f8c80.jpg"
                alt="Construction site"
                className="rounded-xl h-40 sm:h-56 lg:h-64 w-full object-cover"
              />
              <img
                src="https://ethic-group.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-29-a-23.50.29_ea468e3c.jpg"
                alt="Blueprint"
                className="rounded-xl h-40 sm:h-56 lg:h-64 w-full object-cover mt-4 sm:mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-block bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
              Nos services
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
              Une expertise complète pour vos projets
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              De la conception à la réalisation, nous couvrons tous les aspects de votre projet immobilier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <ServiceCard
              icon={<Lightbulb size={28} />}
              title="Études & Conseil"
              description="Analyse de faisabilité, études techniques et conseil en aménagement."
            />
            <ServiceCard
              icon={<PenTool size={28} />}
              title="Conception & Plans"
              description="Plans d'architecture, études structurelles et design d'intérieur."
            />
            <ServiceCard
              icon={<Hammer size={28} />}
              title="Construction"
              description="Réalisation de tous types de bâtiments, du résidentiel au commercial."
            />
            <ServiceCard
              icon={<Wrench size={28} />}
              title="Rénovation"
              description="Réhabilitation et mise aux normes de bâtiments existants."
            />
          </div>

          <div className="mt-8 sm:mt-12 bg-slate-50 rounded-2xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Notre processus</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <ProcessStep number="1" title="Étude" description="Analyse du projet et faisabilité" />
              <ProcessStep number="2" title="Conception" description="Plans et design architectural" />
              <ProcessStep number="3" title="Planification" description="Calendrier et budget" />
              <ProcessStep number="4" title="Construction" description="Réalisation du chantier" />
              <ProcessStep number="5" title="Livraison" description="Remise des clés" />
            </div>
          </div>
        </div>
      </section>

      {/* Galerie de réalisations */}
      <section id="realisations" className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
              Portfolio
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
              Nos réalisations
            </h2>
            <p className="text-slate-600 text-lg">
              Découvrez quelques-uns de nos projets emblématiques
            </p>
          </div>

          {/* Filtres */}
          <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-12 sm:gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-6 sm:text-base ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tous les projets
            </button>
            <button
              onClick={() => setActiveCategory('residential')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-6 sm:text-base ${
                activeCategory === 'residential'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Résidentiel
            </button>
            <button
              onClick={() => setActiveCategory('commercial')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-6 sm:text-base ${
                activeCategory === 'commercial'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Commercial
            </button>
          </div>

          {/* Grille de projets */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedImage(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-block bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
              Notre équipe
            </div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-4xl">
              Des experts à votre service
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Une équipe pluridisciplinaire composée d'architectes, d'ingénieurs et de chefs de projet expérimentés.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <TeamCard key={idx} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="inline-block bg-rose-500/20 text-rose-400 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
                Contact
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
                Discutons de votre projet
              </h2>
              <p className="mb-8 text-base text-slate-300 sm:text-lg">
                Notre équipe est à votre disposition pour étudier votre projet et vous proposer des solutions adaptées à vos besoins et votre budget.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Téléphone</p>
                    <a href="tel:+221781479090" className="text-lg font-semibold hover:text-rose-400 transition-colors">
                      +221 78 147 90 90
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <a href="mailto:mamour@ethic-group.com" className="text-lg font-semibold hover:text-rose-400 transition-colors">
                      mamour@ethic-group.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe size={20} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Site web</p>
                    <a 
                      href="https://www.ethic-group.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg font-semibold hover:text-rose-400 transition-colors"
                    >
                      www.ethic-group.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8">
              <h3 className="mb-6 text-xl font-bold sm:text-2xl">Demander un devis gratuit</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Votre nom complet"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder-slate-400"
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder-slate-400"
                />
                <input
                  type="tel"
                  placeholder="Votre téléphone"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder-slate-400"
                />
                <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white appearance-none cursor-pointer">
                  <option value="">Type de projet</option>
                  <option value="residential">Construction résidentielle</option>
                  <option value="commercial">Construction commerciale</option>
                  <option value="renovation">Rénovation</option>
                  <option value="plans">Conception de plans</option>
                </select>
                <textarea
                  rows="4"
                  placeholder="Décrivez votre projet"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder-slate-400 resize-none"
                />
                <button className="w-full bg-rose-500 hover:bg-rose-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto" onClick={() => setSelectedImage(null)}>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white p-3 sm:p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation z-10"
          >
            <X size={28} className="sm:w-8 sm:h-8" />
          </button>
          <div className="max-w-5xl w-full mt-12 sm:mt-0" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg mb-4 sm:mb-6"
            />
            <div className="text-white">
              <h3 className="text-xl sm:text-3xl font-bold mb-2">{selectedImage.title}</h3>
              <p className="text-slate-300 text-lg mb-4">{selectedImage.description}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-white/10 px-3 py-1 rounded-full">{selectedImage.location}</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">{selectedImage.year}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Components --- */

function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">{number}</div>
      <div className="text-slate-600 font-medium">{label}</div>
    </div>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-all group">
      <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function ProcessStep({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
        {number}
      </div>
      <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-bold text-xl mb-1">{project.title}</h3>
          <p className="text-sm text-slate-200">{project.location}</p>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-900">
          {project.year}
        </div>
      </div>
      <div className="p-6">
        <p className="text-slate-600">{project.description}</p>
      </div>
    </div>
  );
}

function TeamCard({ member }) {
  return (
    <div className="bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="font-bold text-lg text-slate-900 mb-1">{member.name}</h3>
        <p className="text-rose-500 font-medium mb-2">{member.role}</p>
        <p className="text-sm text-slate-500">{member.experience}</p>
      </div>
    </div>
  );
}
