import { Link } from "react-router-dom"
import { Search, Home, Building2, MapPin, Landmark, CheckCircle, Shield, Users, Target, TrendingUp } from "lucide-react"
import PropertySearchFilter from '../components/PropertySearchFilter'

export default function HomePage() {
    return (
        <div className="w-full relative">

            {/* --- Hero Section --- */}
            <section className="relative w-full min-h-[100dvh] sm:min-h-[100vh] flex items-center bg-primary-dark py-12 sm:py-0">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1721013244188-5c4f4593ee72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RGFrYXJ8ZW58MHx8MHx8fDA%3D"
                        alt="ethic immobilier hero"
                        className="w-full h-full object-cover opacity-100"
                    />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/60" />

                {/* Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center text-white mb-8 sm:mb-12">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 sm:mb-4">
                            Trouvez votre futur{' '}
                            <span className="text-primary">bien immobilier</span>
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto px-1">
                            Villas, appartements, terrains… Découvrez les meilleures offres à Dakar et partout au Sénégal.
                        </p>
                    </div>
                    
                    {/* Search Bar  */}
                    <PropertySearchFilter />
                </div>
            </section>

            {/* --- About Section avec Images --- */}
            <section className="py-12 sm:py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Qui sommes-nous */}
                    <div className="mb-16 grid items-center gap-8 sm:gap-12 lg:mb-24 lg:grid-cols-2">
                        <div className="order-2 lg:order-1">
                            <div className="bg-surface rounded-2xl h-56 sm:h-72 lg:h-96 flex items-center justify-center overflow-hidden">
                                <img 
                                    src="https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHRlYW18ZW58MHx8MHx8fDA%3D" 
                                    alt="Notre équipe"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="inline-block bg-secondary-light text-primary px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                                Qui sommes-nous
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-4 sm:mb-6">
                                Votre partenaire immobilier de confiance
                            </h2>
                            <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                                Ethic Immobilier est une agence moderne et dynamique, spécialisée dans la vente, la location et la gestion de biens immobiliers au Sénégal. Nous accompagnons nos clients dans leurs projets avec professionnalisme et transparence.
                            </p>
                            <p className="text-text-muted text-lg leading-relaxed">
                                Notre expertise locale et notre réseau étendu nous permettent de vous proposer les meilleures opportunités du marché, tout en garantissant des transactions sécurisées et un service personnalisé.
                            </p>
                        </div>
                    </div>

                    {/* Notre fonctionnement */}
                    <div className="mb-16 grid items-center gap-8 sm:gap-12 lg:mb-24 lg:grid-cols-2">
                        <div>
                            <div className="inline-block bg-surface text-text-main px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                                Notre fonctionnement
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-6">
                                Un processus simple et efficace
                            </h2>
                            <div className="space-y-6">
                                <ProcessStep 
                                    number="1"
                                    title="Recherche personnalisée"
                                    description="Utilisez nos filtres avancés ou contactez nos agents pour trouver le bien qui vous correspond."
                                />
                                <ProcessStep 
                                    number="2"
                                    title="Visite et conseil"
                                    description="Nous organisons des visites sur mesure et vous conseillons sur chaque aspect de votre projet."
                                />
                                <ProcessStep 
                                    number="3"
                                    title="Transaction sécurisée"
                                    description="Nous gérons toutes les démarches administratives et juridiques pour une transaction en toute sérénité."
                                />
                                <ProcessStep 
                                    number="4"
                                    title="Suivi post-vente"
                                    description="Notre accompagnement continue après la signature pour garantir votre satisfaction."
                                />
                            </div>
                        </div>
                        <div>
                            <div className="bg-surface rounded-2xl h-64 sm:h-80 lg:h-[500px] flex items-center justify-center overflow-hidden">
                                <img 
                                    src="https://plus.unsplash.com/premium_photo-1726797661357-f7897f35f865?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvY2Vzc3xlbnwwfHwwfHx8MA%3D%3D" 
                                    alt="Notre processus"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Nos Valeurs --- */}
            <section className="bg-surface py-12 sm:py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10 sm:mb-16">
                        <div className="inline-block bg-white text-text-main px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                            Nos valeurs
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-4">
                            Ce qui nous distingue
                        </h2>
                        <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
                            Des principes solides qui guident chacune de nos actions et garantissent votre satisfaction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <ValueCard 
                            icon={<Shield size={28} />}
                            title="Transparence"
                            description="Des informations claires et vérifiées pour chaque bien. Aucune surprise, juste de l'honnêteté."
                        />
                        <ValueCard 
                            icon={<Users size={28} />}
                            title="Proximité"
                            description="Une équipe à votre écoute, disponible et réactive pour répondre à tous vos besoins."
                        />
                        <ValueCard 
                            icon={<Target size={28} />}
                            title="Excellence"
                            description="Un service de qualité supérieure à chaque étape de votre parcours immobilier."
                        />
                        <ValueCard 
                            icon={<TrendingUp size={28} />}
                            title="Innovation"
                            description="Des outils modernes et une plateforme digitale pour faciliter vos recherches."
                        />
                    </div>
                </div>
            </section>

            {/* --- Nos Objectifs --- */}
            <section className="py-12 sm:py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div className="bg-primary-dark rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
                            <div className="inline-block bg-primary/20 text-rose-400 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
                                Nos objectifs
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                                Bâtir l'avenir de l'immobilier au Sénégal
                            </h2>
                            <div className="space-y-6">
                                <ObjectiveItem 
                                    title="Démocratiser l'accès à la propriété"
                                    description="Rendre l'immobilier accessible à tous grâce à des solutions innovantes et des conseils personnalisés."
                                />
                                <ObjectiveItem 
                                    title="Accompagner le développement urbain"
                                    description="Participer activement à la croissance des villes sénégalaises avec des projets durables."
                                />
                                <ObjectiveItem 
                                    title="Créer une communauté de confiance"
                                    description="Rassembler propriétaires, locataires et investisseurs autour de valeurs communes."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                            <StatCard number="500+" label="Biens disponibles" />
                            <StatCard number="1200+" label="Clients satisfaits" />
                            <StatCard number="15+" label="Années d'expérience" />
                            <StatCard number="98%" label="Taux de satisfaction" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Types de biens --- */}
            <section className="bg-surface py-12 sm:py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-4">Types de biens</h2>
                        <p className="text-text-muted text-base sm:text-lg">Explorez notre catalogue par catégorie</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6">
                        <CategoryCard
                            icon={<Home size={28} />}
                            label="Villas"
                            count="150+ biens"
                            link="/recherche?type=villa"
                        />
                        <CategoryCard
                            icon={<Building2 size={28} />}
                            label="Appartements"
                            count="280+ biens"
                            link="/search?type=appartement"
                        />
                        <CategoryCard
                            icon={<Landmark size={28} />}
                            label="Terrains"
                            count="90+ biens"
                            link="/search?type=terrain"
                        />
                        <CategoryCard
                            icon={<MapPin size={28} />}
                            label="Bureaux"
                            count="45+ biens"
                            link="/search?type=bureau"
                        />
                    </div>
                </div>
            </section>

            
            {/* --- CTA Final --- */}
            <section className="bg-primary-dark py-12 sm:py-20 px-4 sm:px-6 text-center text-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        Prêt à trouver votre futur logement ?
                    </h2>
                    <p className="text-base sm:text-lg text-border mb-6 sm:mb-8">
                        Contactez-nous dès aujourd'hui et bénéficiez d'un accompagnement personnalisé
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Link 
                            to="/contact"
                            className="bg-primary text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                        >
                            Nous contacter
                        </Link>
                        <Link 
                            to="/search"
                            className="bg-white text-text-main px-8 py-3.5 rounded-lg font-semibold hover:bg-surface transition-colors"
                        >
                            Parcourir les biens
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

/* --- Process Step Component --- */
function ProcessStep({ number, title, description }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                {number}
            </div>
            <div>
                <h3 className="font-semibold text-lg text-text-main mb-2">{title}</h3>
                <p className="text-text-muted leading-relaxed">{description}</p>
            </div>
        </div>
    )
}

/* --- Value Card Component --- */
function ValueCard({ icon, title, description }) {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-secondary-light text-primary rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="font-bold text-xl text-text-main mb-3">{title}</h3>
            <p className="break-words text-text-muted leading-relaxed">{description}</p>
        </div>
    )
}

/* --- Objective Item Component --- */
function ObjectiveItem({ title, description }) {
    return (
        <div className="border-l-4 border-primary pl-6">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-border leading-relaxed">{description}</p>
        </div>
    )
}

/* --- Stat Card Component --- */
function StatCard({ number, label }) {
    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main mb-1 sm:mb-2">{number}</div>
            <div className="text-text-muted font-medium text-sm sm:text-base">{label}</div>
        </div>
    )
}

/* --- Category Card Component --- */
function CategoryCard({ icon, label, count, link }) {
    return (
        <Link
            to={link}
            className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl hover:shadow-lg transition-shadow group"
        >
            <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{icon}</div>
            <p className="mb-1 break-words text-base font-semibold text-text-main sm:text-lg">{label}</p>
            <p className="text-sm text-text-muted">{count}</p>
        </Link>
    )
}

