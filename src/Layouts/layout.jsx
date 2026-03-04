import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MapPin, Mail, ChevronDown } from 'lucide-react'

export default function Layout() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
        setServicesDropdownOpen(false)
    }, [location])

    return (
        <>
            {/* HEADER */}
            <header
                className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white shadow-sm'
                        : 'bg-white'
                }`}
            >
                <nav className="container mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* LOGO */}
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                                <span className="text-white font-semibold text-base">E</span>
                            </div>
                            <span className="text-xl font-semibold text-slate-900 tracking-tight">
                                Ethic Immobilier
                            </span>
                        </Link>

                        {/* NAV DESKTOP */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <NavLink to="/" label="Accueil" />
                            <NavLink to="/search" label="Biens Immobillier" />
                            <NavLink to="/build" label="Construire" />
                            <NavLink to="/contact" label="Contact" />
                            <NavLink to="/admin" label="admin" />

                            {/* CTA */}
                            <Link
                                to="/search"
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                            >
                                Trouver un bien
                            </Link>
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                {menuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* MOBILE MENU */}
                    {menuOpen && (
                        <div className="lg:hidden py-4 border-t border-slate-100">
                            <div className="space-y-1">
                                <MobileNavLink to="/" label="Accueil" />
                                <MobileNavLink to="/search" label="Biens Immobillier" />
                                <MobileNavLink to="/build" label="construire" />
                                <MobileNavLink to="/contact" label="Contact" />


                                <div className="pt-4">
                                    <Link
                                        to="/search"
                                        className="block w-full bg-slate-900 text-white text-center py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        Trouver un bien
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* CONTENU */}
            <main className="pt-20">
                <Outlet />
            </main>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-300 mt-24">
                <div className="container mx-auto px-6 lg:px-8">
                    
                    {/* Contenu principal */}
                    <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                        {/* LOGO & DESCRIPTION */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                                    <span className="text-slate-900 font-semibold text-base">E</span>
                                </div>
                                <h2 className="text-lg font-semibold text-white">Ethic Immobilier</h2>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-400">
                                Votre partenaire de confiance pour tous vos projets immobiliers au Sénégal.
                            </p>
                        </div>

                        {/* SERVICES */}
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Services</h3>
                            <div className="space-y-3">
                                <FooterLink to="/build" label="Expertise immobilière" />
                                <FooterLink to="/build" label="Plans & Construction" />
                                <FooterLink to="/build" label="Gestion locative" />
                            </div>
                        </div>

                        {/* NAVIGATION */}
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navigation</h3>
                            <div className="space-y-3">
                                <FooterLink to="/" label="Accueil" />
                                <FooterLink to="/search" label="Biens Immobillier" />
                                <FooterLink to="/contact" label="Contact" />
                            </div>
                        </div>

                        {/* CONTACT */}
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h3>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <Phone size={16} className="mt-0.5 text-slate-400" />
                                    <span className="text-sm">+221 78 147 90 90 </span>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Mail size={16} className="mt-0.5 text-slate-400" />
                                    <span className="text-sm">immo@ethic-group.com</span>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <MapPin size={16} className="mt-0.5 text-slate-400" />
                                    <span className="text-sm">Dakar, Sénégal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-slate-800 py-6">
                        <p className="text-center text-sm text-slate-500">
                            © {new Date().getFullYear()} Ethic Immobilier. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    )
}

/* --- COMPONENTS --- */

function NavLink({ to, label }) {
    return (
        <Link
            to={to}
            className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
        >
            {label}
        </Link>
    )
}

function MobileNavLink({ to, label, indent = false }) {
    return (
        <Link 
            to={to} 
            className={`block py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium ${
                indent ? 'pl-6' : 'px-3'
            }`}
        >
            {label}
        </Link>
    )
}

function DropdownItem({ to, label }) {
    return (
        <Link
            to={to}
            className="block px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm transition-colors"
        >
            {label}
        </Link>
    )
}

function FooterLink({ to, label }) {
    return (
        <Link 
            to={to} 
            className="block text-sm text-slate-400 hover:text-white transition-colors"
        >
            {label}
        </Link>
    )
}