import React, { useState, useEffect } from 'react';
import { Search, Plus, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PropertySearchFilter() {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState('location');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: '',
    region: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    minSurface: '',
    maxSurface: '',
    bedrooms: '',
    bathrooms: '',
    rooms: ''
  });
  // Ajouts dynamiques cities/districts
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');

  useEffect(() => {
    fetch('https://immo-backend-b2x5.onrender.com/cities')
      .then(res => res.json())
      .then(setCities)
      .catch(console.error);
  }, []);

  const handleSubmit = () => {
    // Construire les query parameters
    const params = new URLSearchParams();
    
    // Ajouter les filtres non-vides
    if (transactionType) params.append('transactionType', transactionType);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (selectedCityId) params.append('cityId', selectedCityId);
    if (selectedDistrictId) params.append('districtId', selectedDistrictId);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minSurface) params.append('minSurface', filters.minSurface);
    if (filters.maxSurface) params.append('maxSurface', filters.maxSurface);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);
    if (filters.rooms) params.append('rooms', filters.rooms);
    
    // Naviguer vers la page de recherche avec les paramètres
    navigate(`/search?${params.toString()}`);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      propertyType: '',
      region: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      minSurface: '',
      maxSurface: '',
      bedrooms: '',
      bathrooms: '',
      rooms: ''
    });
    setSelectedCityId('');
    setSelectedDistrictId('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* TYPE DE TRANSACTION */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setTransactionType('achat')}
            className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
              transactionType === 'achat'
                ? 'bg-white text-rose-500 border-b-2 border-rose-500'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Achat
          </button>
          <button
            onClick={() => setTransactionType('location')}
            className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
              transactionType === 'location'
                ? 'bg-white text-rose-500 border-b-2 border-rose-500'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Location
          </button>
          <button
            onClick={() => setTransactionType('location-saisonniere')}
            className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
              transactionType === 'location-saisonniere'
                ? 'bg-white text-rose-500 border-b-2 border-rose-500'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Location Saisonnière
          </button>
        </div>

        {/* FILTRES PRINCIPAUX */}
        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Type de bien */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Type de biens
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">Tous les types</option>
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="terrain">Terrain</option>
                <option value="bureau">Bureau</option>
                <option value="commerce">Commerce</option>
              </select>
              <ChevronDown className="absolute right-3 top-10 text-slate-400 pointer-events-none" size={18} />
            </div>

           

            {/* Ville dynamique */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Ville
              </label>
              <select
                value={selectedCityId}
                onChange={e => {
                  setSelectedCityId(e.target.value);
                  setSelectedDistrictId('');
                  handleFilterChange('city', e.target.value);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">Toutes les villes</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-10 text-slate-400 pointer-events-none" size={18} />
            </div>
            {/* Quartier dynamique */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Quartier
              </label>
              <select
                value={selectedDistrictId}
                onChange={e => {
                  setSelectedDistrictId(e.target.value);
                  handleFilterChange('district', e.target.value);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">Tous les quartiers</option>
                {cities.find(c => String(c.id) === String(selectedCityId))?.districts.map(q => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-10 text-slate-400 pointer-events-none" size={18} />
            </div>

            {/* Bouton Avancée */}
            <div className="flex items-end">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full bg-rose-500 hover:bg-rose-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
              >
                {showAdvanced ? (
                  <>
                    <X size={18} />
                    <span>Masquer</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Avancée</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* FILTRES AVANCÉS */}
          <div 
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showAdvanced 
                ? 'max-h-[600px] opacity-100 mt-6' 
                : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* Prix */}
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    Budget
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="flex-1 min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <span className="text-slate-400 flex-shrink-0">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="flex-1 min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Surface */}
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    Surface (m²)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minSurface}
                      onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                      className="flex-1 min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <span className="text-slate-400 flex-shrink-0">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxSurface}
                      onChange={(e) => handleFilterChange('maxSurface', e.target.value)}
                      className="flex-1 min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Chambres */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    Chambres
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Indifférent</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-10 text-slate-400 pointer-events-none" size={18} />
                </div>

                {/* Salles de bains */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    Salles de bains
                  </label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Indifférent</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-10 text-slate-400 pointer-events-none" size={18} />
                </div>

                {/* Pièces */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    Pièces
                  </label>
                  <select
                    value={filters.rooms}
                    onChange={(e) => handleFilterChange('rooms', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Indifférent</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                    <option value="6">6+</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-10 text-slate-400 pointer-events-none" size={18} />
                </div>

                {/* Réinitialiser */}
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full py-3 border-2 border-slate-300 text-slate-600 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOUTON RECHERCHER */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-rose-500 hover:bg-rose-700 text-white py-4 rounded-lg font-semibold text-base transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/30"
            >
              <Search size={20} />
              <span>Chercher</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}