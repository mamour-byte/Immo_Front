import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Check } from 'lucide-react';

function DistrictMultiSelect({ districts, selectedIds, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Calcule la position du dropdown par rapport au trigger
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 320; // hauteur max estimée

    const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setDropdownStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(showAbove
        ? { bottom: viewportHeight - rect.top + 6 }
        : { top: rect.bottom + 6 }),
    });
  };


const searchRef = useRef(null);


useEffect(() => {
  if (open) {
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    // Focus sans scroll
    setTimeout(() => {
      searchRef.current?.focus({ preventScroll: true });
    }, 0);
  }
  return () => {
    window.removeEventListener('scroll', updatePosition, true);
    window.removeEventListener('resize', updatePosition);
  };
}, [open]);

  // Fermer au clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (id) => {
    onChange(selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id]
    );
  };

  const filtered = districts.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  const dropdown = open && (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
    >
      {/* Search */}
      <div className="p-2.5 border-b border-slate-100">
        <input
          searchRef
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un quartier..."
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
      </div>

      {/* Options */}
      <div className="max-h-52 overflow-y-auto p-1.5">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-4">Aucun quartier trouvé</p>
        ) : filtered.map(d => {
          const isSelected = selectedIds.includes(d.id);
          return (
            <div
              key={d.id}
              onClick={() => toggle(d.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-sm transition-colors ${
                isSelected ? 'bg-rose-50 text-rose-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                isSelected ? 'bg-rose-500 border-rose-500' : 'border-slate-300 bg-white'
              }`}>
                {isSelected && <Check size={10} color="white" strokeWidth={3} />}
              </div>
              {d.name}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">{selectedIds.length} sélectionné(s)</span>
        {selectedIds.length > 0 && (
          <button onClick={() => onChange([])} className="text-xs text-rose-500 hover:text-rose-700">
            Tout effacer
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
        Quartier
      </label>

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
      >
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selectedIds.length === 0 ? (
            <span className="text-slate-400">Tous les quartiers</span>
          ) : (
            selectedIds.map(id => {
              const d = districts.find(x => x.id === id);
              return (
                <span
                  key={id}
                  className="flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-full px-2.5 py-0.5"
                >
                  <span className="truncate max-w-[100px]">{d?.name}</span>
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); toggle(id); }}
                    className="flex items-center cursor-pointer hover:text-rose-900"
                  >
                    <X size={11} />
                  </span>
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Portal — rendu directement dans le body, hors de tout overflow hidden */}
      {createPortal(dropdown, document.body)}
    </div>
  );
}

export default DistrictMultiSelect;