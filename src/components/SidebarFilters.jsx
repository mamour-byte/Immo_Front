import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export default function SidebarFilters({ onFiltersChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [filters, setFilters] = useState({
    transactionType: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minSurface: '',
    maxSurface: '',
    bedrooms: '',
    bathrooms: '',
    guests: '',
    startDate: '',
    endDate: '',
    stayDays: '',
    region: '',
    city: '',
  });

  useEffect(() => {
    fetch('https://immo-backend-b2x5.onrender.com/cities')
      .then((res) => res.json())
      .then(setCities)
      .catch(console.error);
  }, []);

  const isDailyRental = filters.transactionType === 'location-journaliere';

  const stayDaysFromDates = useMemo(() => {
    if (!filters.startDate || !filters.endDate) return null;
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    const ms = end.getTime() - start.getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  }, [filters.startDate, filters.endDate]);

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

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDrawer = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      trackEvent('search_filters_opened', {
        source: 'sidebar_mobile',
      });
    }
  };

  const resetFilters = () => {
    const resetFiltersState = {
      transactionType: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minSurface: '',
      maxSurface: '',
      bedrooms: '',
      bathrooms: '',
      guests: '',
      startDate: '',
      endDate: '',
      stayDays: '',
      region: '',
      city: '',
    };

    setFilters(resetFiltersState);
    setSelectedCityId('');
    setSelectedDistrictId('');

    if (onFiltersChange) {
      onFiltersChange({
        ...resetFiltersState,
        cityId: '',
        districtId: '',
      });
    }

    trackEvent('search_filters_reset', {
      source: 'sidebar',
    });
  };

  const applyFilters = () => {
    const rentalMode =
      filters.transactionType === 'location-journaliere'
        ? 'DAILY'
        : filters.transactionType === 'location'
          ? 'MONTHLY'
          : '';

    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        rentalMode,
        cityId: selectedCityId,
        districtId: selectedDistrictId,
      });
    }

    const activeFiltersCount = Object.values({
      transactionType: filters.transactionType,
      propertyType: filters.propertyType,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minSurface: filters.minSurface,
      maxSurface: filters.maxSurface,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      guests: filters.guests,
      startDate: filters.startDate,
      endDate: filters.endDate,
      stayDays: filters.stayDays,
      cityId: selectedCityId,
      districtId: selectedDistrictId,
    }).filter(Boolean).length;

    trackEvent('search_filters_applied', {
      transaction_type: filters.transactionType || 'all',
      property_type: filters.propertyType || 'all',
      rental_mode: rentalMode || 'all',
      city_id: selectedCityId || '',
      district_id: selectedDistrictId || '',
      has_budget: Boolean(filters.minPrice || filters.maxPrice),
      has_surface: Boolean(filters.minSurface || filters.maxSurface),
      guests: Number(filters.guests) || null,
      stay_days: Number(filters.stayDays) || effectiveStayDays || null,
      active_filters_count: activeFiltersCount,
    });

    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="lg:hidden fixed top-[max(4.5rem,env(safe-area-inset-top))] left-4 z-50 bg-slate-900 text-white p-3.5 rounded-full shadow-lg hover:bg-slate-800 transition-colors touch-manipulation"
        aria-label={isOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'}
      >
        <SlidersHorizontal size={22} className="sm:w-6 sm:h-6" />
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 lg:top-20 left-0 h-[100dvh] lg:h-[calc(100vh-5rem)]
          w-[min(320px,100vw-2rem)] max-w-full lg:w-80 bg-white border-r border-slate-200
          overflow-y-auto z-50 transition-transform duration-300 ease-out
          shadow-xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Filtres</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
              Transaction
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-2">
              <button
                onClick={() => handleFilterChange('transactionType', '')}
                className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  !filters.transactionType ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => handleFilterChange('transactionType', 'achat')}
                className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  filters.transactionType === 'achat'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Achat
              </button>
              <button
                onClick={() => handleFilterChange('transactionType', 'location')}
                className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  filters.transactionType === 'location'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Mensuelle
              </button>
              <button
                onClick={() => handleFilterChange('transactionType', 'location-journaliere')}
                className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  filters.transactionType === 'location-journaliere'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Journaliere
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
              Type de bien
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer transition-all"
            >
              <option value="">Tous les types</option>
              <option value="appartement">Appartement</option>
              <option value="maison">Maison</option>
              <option value="terrain">Terrain</option>
              <option value="bureau">Bureau</option>
              <option value="commerce">Commerce</option>
            </select>
            <ChevronDown className="absolute right-3 top-11 text-slate-400 pointer-events-none" size={18} />
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
              Ville
            </label>
            <select
              value={selectedCityId}
              onChange={(e) => {
                setSelectedCityId(e.target.value);
                setSelectedDistrictId('');
                handleFilterChange('city', e.target.value);
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer transition-all"
            >
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-11 text-slate-400 pointer-events-none" size={18} />
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
              Quartier
            </label>
            <select
              value={selectedDistrictId}
              onChange={(e) => {
                setSelectedDistrictId(e.target.value);
                handleFilterChange('district', e.target.value);
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer transition-all"
            >
              <option value="">Tous les quartiers</option>
              {cities.find((c) => String(c.id) === String(selectedCityId))?.districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-11 text-slate-400 pointer-events-none" size={18} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
              Budget (FCFA)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="flex-1 min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="flex-1 min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {isDailyRental ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  Nombre de personnes
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ex: 2"
                  value={filters.guests}
                  onChange={(e) => handleFilterChange('guests', e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  Date de debut
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  Date de fin
                </label>
                <input
                  type="date"
                  min={filters.startDate || undefined}
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
                {stayDaysFromDates && <p className="mt-2 text-xs text-slate-500">Duree estimee: {stayDaysFromDates} jour(s)</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  Nombre de jours
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ex: 3"
                  value={filters.stayDays}
                  onChange={(e) => handleFilterChange('stayDays', e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="rounded-lg border border-rose-100 bg-rose-50 p-3">
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
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  Surface (m2)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minSurface}
                    onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                    className="flex-1 min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxSurface}
                    onChange={(e) => handleFilterChange('maxSurface', e.target.value)}
                    className="flex-1 min-w-0 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  Chambres
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                >
                  <option value="">Indifferent</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
                <ChevronDown className="absolute right-3 top-11 text-slate-400 pointer-events-none" size={18} />
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  Salles de bains
                </label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                >
                  <option value="">Indifferent</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
                <ChevronDown className="absolute right-3 top-11 text-slate-400 pointer-events-none" size={18} />
              </div>
            </>
          )}

          <div className="pt-4 space-y-3 border-t border-slate-200">
            <button
              onClick={applyFilters}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Appliquer les filtres
            </button>
            <button
              onClick={resetFilters}
              className="w-full border-2 border-slate-300 text-slate-600 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Reinitialiser
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
