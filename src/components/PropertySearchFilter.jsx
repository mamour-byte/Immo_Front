import React, { useState, useEffect } from 'react';
import { Search, Plus, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DistrictMultiSelect from './DistrictMultiSelect';

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
    rooms: '',
    guests: '',
    startDate: '',
    endDate: '',
    stayDays: '',
  });
  // Ajouts dynamiques cities/districts
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedDistrictIds, setSelectedDistrictIds] = useState([]);
  const isDailyRental = transactionType === 'location-journaliere';

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
    if (transactionType === 'location') params.append('rentalMode', 'MONTHLY');
    if (transactionType === 'location-journaliere') params.append('rentalMode', 'DAILY');
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (selectedCityId) params.append('cityId', selectedCityId);
    if (selectedDistrictIds.length > 0) {
      selectedDistrictIds.forEach(id => params.append('districtId', id));
    }
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (isDailyRental) {
      if (filters.guests) params.append('guests', filters.guests);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.stayDays) params.append('stayDays', filters.stayDays);
    } else {
      if (filters.minSurface) params.append('minSurface', filters.minSurface);
      if (filters.maxSurface) params.append('maxSurface', filters.maxSurface);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);
      if (filters.rooms) params.append('rooms', filters.rooms);
    }
    
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
      rooms: '',
      guests: '',
      startDate: '',
      endDate: '',
      stayDays: '',
    });
    setSelectedCityId('');
    setSelectedDistrictIds([]);
  };

  const stayDaysFromDates = (() => {
    if (!filters.startDate || !filters.endDate) return null;
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    const ms = end.getTime() - start.getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  })();

  useEffect(() => {
    if (!stayDaysFromDates) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters((prev) =>
      String(prev.stayDays || "") === String(stayDaysFromDates)
        ? prev
        : { ...prev, stayDays: String(stayDaysFromDates) },
    );
  }, [stayDaysFromDates]);

  const effectiveStayDays = Number(filters.stayDays) > 0 ? Number(filters.stayDays) : stayDaysFromDates;
  const estimatedMinTotal =
    effectiveStayDays && Number(filters.minPrice) > 0 ? Number(filters.minPrice) * effectiveStayDays : null;
  const estimatedMaxTotal =
    effectiveStayDays && Number(filters.maxPrice) > 0 ? Number(filters.maxPrice) * effectiveStayDays : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
        
        {/* TYPE DE TRANSACTION */}
        <div className="grid grid-cols-3 gap-1 sm:gap-0 border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setTransactionType('achat')}
            className={`min-w-0 px-2 py-3 sm:py-4 text-[11px] sm:text-sm font-semibold leading-tight transition-colors rounded-sm sm:rounded-none ${
              transactionType === 'achat'
                ? 'bg-white text-rose-500 border-b-2 border-rose-500'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Achat
          </button>
          <button
            onClick={() => setTransactionType('location')}
            className={`min-w-0 px-2 py-3 sm:py-4 text-[11px] sm:text-sm font-semibold leading-tight transition-colors rounded-sm sm:rounded-none ${
              transactionType === 'location'
                ? 'bg-white text-rose-500 border-b-2 border-rose-500'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className="hidden sm:inline">Location mensuelle</span>
            <span className="sm:hidden">Mensuelle</span>
          </button>
          <button
            onClick={() => setTransactionType('location-journaliere')}
            className={`min-w-0 px-2 py-3 sm:py-4 text-[11px] sm:text-sm font-semibold leading-tight transition-colors rounded-sm sm:rounded-none ${
              transactionType === 'location-journaliere'
                ? 'bg-white text-rose-500 border-b-2 border-rose-500'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className="hidden sm:inline">Location Journaliere</span>
            <span className="sm:hidden">Journaliere</span>
          </button>
        </div>

        {/* FILTRES PRINCIPAUX */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
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
                  setSelectedDistrictIds([]);
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
            <DistrictMultiSelect
              districts={cities.find(c => String(c.id) === String(selectedCityId))?.districts || []}
              selectedIds={selectedDistrictIds.map(Number)}
              onChange={(ids) => {
                setSelectedDistrictIds(ids);
                handleFilterChange('district', ids.join(','));
              }}
            />
            {/* <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Quartier
              </label>
              <select
                multiple
                value={selectedDistrictIds}
                onChange={e => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setSelectedDistrictIds(values);
                  handleFilterChange('district', values.join(','));
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {cities.find(c => String(c.id) === String(selectedCityId))?.districts?.map(q => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                )) || []}
              </select>
              <ChevronDown className="absolute right-3 top-10 text-slate-400 pointer-events-none" size={18} />
            </div> */}

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

                {isDailyRental ? (
                  <>
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                        Nombre de personnes
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Ex: 2"
                        value={filters.guests}
                        onChange={(e) => handleFilterChange('guests', e.target.value)}
                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                        Date de debut
                      </label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        min={filters.startDate || undefined}
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                      {stayDaysFromDates && <p className="text-xs text-slate-500 mt-2">Duree estimee: {stayDaysFromDates} jour(s)</p>}
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                        Nombre de jours
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Ex: 3"
                        value={filters.stayDays}
                        onChange={(e) => handleFilterChange('stayDays', e.target.value)}
                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>

                    <div className="min-w-0 sm:col-span-2 lg:col-span-3 rounded-lg border border-rose-100 bg-rose-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 mb-1">Estimation rapide</p>
                      <p className="text-sm text-slate-700">
                        Total sejour ({effectiveStayDays || 0} jour(s)):
                        {" "}
                        {estimatedMinTotal ? `${estimatedMinTotal.toLocaleString()} FCFA` : "-"}
                        {" "}
                        a
                        {" "}
                        {estimatedMaxTotal ? `${estimatedMaxTotal.toLocaleString()} FCFA` : "-"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Surface */}
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                        Surface (m2)
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
                        <option value="">Indifferent</option>
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
                        <option value="">Indifferent</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-10 text-slate-400 pointer-events-none" size={18} />
                    </div>

                    {/* Pieces */}
                    <div className="relative">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                        Pieces
                      </label>
                      <select
                        value={filters.rooms}
                        onChange={(e) => handleFilterChange('rooms', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">Indifferent</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                        <option value="6">6+</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-10 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </>
                )}

                {/* Reinitialiser */}
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
          <div className="mt-4 sm:mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-rose-500 hover:bg-rose-700 text-white py-3.5 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30"
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




