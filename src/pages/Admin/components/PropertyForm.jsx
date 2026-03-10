// components/PropertyForm.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { TYPE_OPTIONS, PURPOSE_OPTIONS, STATUS_OPTIONS, FEATURES_OPTIONS } from "../constants/propertyOptions";

export default function PropertyForm({ initial = null, cities = [], districts = [], onCancel, onSubmit, isLoading = false }) {
  const MAX_FILES = 15;

  const [form, setForm] = useState(() => {
    const initialImageUrls = (initial?.images ?? [])
      .map((i) => i?.url || i)
      .filter(Boolean);

    return ({
      id: initial?.id ?? null,
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      purpose: initial?.purpose ?? "VENTE",
      type: initial?.type ?? "APPARTMENT",
      price: initial?.price ?? "",
      surface: initial?.surface ?? "",
      bedrooms: initial?.bedrooms ?? "",
      bathrooms: initial?.bathrooms ?? "",
      toilets: initial?.toilets ?? "",
      status: initial?.status ?? "AVAILABLE",
      cityId: initial?.cityId || initial?.city?.id || "",
      districtId: initial?.districtId || initial?.district?.id || "",
      latitude: initial?.latitude ?? "",
      longitude: initial?.longitude ?? "",
      features: Array.isArray(initial?.features)
        ? initial.features
            .map((f) => (typeof f === "object" && f !== null ? f.featureId || f.id || f.value || null : f))
            .filter((v) => v !== null && v !== undefined)
        : [],
      // En création, on force au moins un champ visible (sinon tableau vide).
      images: initialImageUrls.length ? initialImageUrls : [""],
    });
  });

  const [files, setFiles] = useState([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState([]);
  const previewsRef = useRef([]);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    previewsRef.current = filePreviewUrls;
  }, [filePreviewUrls]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((p) => {
        try { URL.revokeObjectURL(p.url); } catch {}
      });
    };
  }, []);

  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => !form.cityId || String(d.cityId) === String(form.cityId));
  }, [districts, form.cityId]);

  function update(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    // Clear error for this field when user starts editing
    if (errors[key]) {
      setErrors(e => ({ ...e, [key]: null }));
    }
  }

  function toggleFeature(value) {
    setForm((f) => {
      const exists = f.features?.includes(value);
      const next = exists ? f.features.filter((v) => v !== value) : [...(f.features || []), value];
      return { ...f, features: next };
    });
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);

    // Eviter les leaks memoire (object URLs)
    filePreviewUrls.forEach((p) => {
      try { URL.revokeObjectURL(p.url); } catch {}
    });

    setFileError("");
    const newFiles = selected.slice(0, MAX_FILES);
    if (selected.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} images.`);
    }

    // Créer des previews pour les nouveaux fichiers
    const newPreviews = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file,
    }));
    
    setFiles(newFiles);
    setFilePreviewUrls(newPreviews);
  }

  function removeNewImage(idx) {
    const removed = filePreviewUrls[idx];
    if (removed?.url) {
      try { URL.revokeObjectURL(removed.url); } catch {}
    }
    const newPreviews = filePreviewUrls.filter((_, i) => i !== idx);
    const newFiles = files.filter((_, i) => i !== idx);
    setFilePreviewUrls(newPreviews);
    setFiles(newFiles);
  }

  function removeExistingImage(idx) {
    const newImages = form.images.filter((_, i) => i !== idx);
    setForm(f => ({ ...f, images: newImages }));
  }

  function validate() {
    const newErrors = {};
    if (!form.title?.trim()) newErrors.title = "Le titre est obligatoire";
    if (!form.description?.trim()) newErrors.description = "La description est obligatoire";
    if (!form.cityId) newErrors.cityId = "La ville est obligatoire";
    if (!form.type) newErrors.type = "Le type est obligatoire";
    if (form.price === "" || form.price === null) newErrors.price = "Le prix est obligatoire";
    if (form.price && isNaN(Number(form.price))) newErrors.price = "Le prix doit être un nombre";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function submit(e) {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const payload = {
      ...form,
      // Ne garder que les URLs d'images non vides
      images: (form.images || []).map((u) => u?.trim?.() ?? "").filter((u) => u.length > 0),
      price: form.price ? Number(form.price) : undefined,
      surface: form.surface ? Number(form.surface) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      toilets: form.toilets ? Number(form.toilets) : undefined,
      cityId: form.cityId ? Number(form.cityId) : undefined,
      districtId: form.districtId ? Number(form.districtId) : undefined,
      latitude: form.latitude !== "" ? Number(form.latitude) : undefined,
      longitude: form.longitude !== "" ? Number(form.longitude) : undefined,
      features: (form.features || []).map((f) => Number(f)).filter((v) => !Number.isNaN(v)),
    };
    onSubmit({ ...payload, files });
  }

  const hasExistingImages = form.images.some(img => img?.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
        <form onSubmit={submit} className="space-y-4">
          <h3 className="text-lg font-medium">{form.id ? "Modifier le bien" : "Nouveau bien"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input 
                value={form.title} 
                onChange={(e) => update("title", e.target.value)} 
                placeholder="Titre *" 
                className={`p-2 border rounded w-full ${errors.title ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title}</span>}
            </div>
            
            <div>
              <select 
                value={form.purpose} 
                onChange={(e) => update("purpose", e.target.value)} 
                className="p-2 border rounded w-full"
                disabled={isLoading}
              >
                {PURPOSE_OPTIONS.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
              </select>
            </div>

            <div>
              <select 
                value={form.type} 
                onChange={(e) => update("type", e.target.value)} 
                className={`p-2 border rounded w-full ${errors.type ? 'border-red-500' : ''}`}
                disabled={isLoading}
              >
                {TYPE_OPTIONS.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
              </select>
              {errors.type && <span className="text-red-500 text-xs mt-1">{errors.type}</span>}
            </div>

            <div>
              <select 
                value={form.cityId} 
                onChange={(e) => { update("cityId", e.target.value); update("districtId", ""); }} 
                className={`p-2 border rounded w-full ${errors.cityId ? 'border-red-500' : ''}`}
                disabled={isLoading}
              >
                <option value="">Ville *</option>
                {cities.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
              {errors.cityId && <span className="text-red-500 text-xs mt-1">{errors.cityId}</span>}
            </div>

            <div>
              <select 
                value={form.districtId} 
                onChange={(e) => update("districtId", e.target.value)} 
                className="p-2 border rounded w-full"
                disabled={isLoading}
              >
                <option value="">Quartier</option>
                {filteredDistricts.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
              </select>
            </div>

            <div>
              <input 
                value={form.price} 
                onChange={(e) => update("price", e.target.value)} 
                type="number" 
                placeholder="Prix *" 
                className={`p-2 border rounded w-full ${errors.price ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.price && <span className="text-red-500 text-xs mt-1">{errors.price}</span>}
            </div>

            <input 
              value={form.surface} 
              onChange={(e) => update("surface", e.target.value)} 
              type="number" 
              step="0.01"
              placeholder="Surface (m²)" 
              className="p-2 border rounded"
              disabled={isLoading}
            />

            <input 
              value={form.bedrooms} 
              onChange={(e) => update("bedrooms", e.target.value)} 
              type="number" 
              placeholder="Chambres" 
              className="p-2 border rounded"
              disabled={isLoading}
            />
            <input 
              value={form.toilets} 
              onChange={(e) => update("toilets", e.target.value)} 
              type="number" 
              placeholder="Toilettes" 
              className="p-2 border rounded"
              disabled={isLoading}
            />

            <select 
              value={form.status} 
              onChange={(e) => update("status", e.target.value)} 
              className="p-2 border rounded"
              disabled={isLoading}
            >
              {STATUS_OPTIONS.map(s => (<option key={s.value} value={s.value}>{s.label}</option>))}
            </select>

            <textarea 
              value={form.description} 
              onChange={(e) => update("description", e.target.value)} 
              placeholder="Description *" 
              className={`p-2 border rounded col-span-1 md:col-span-2 ${errors.description ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.description && <span className="text-red-500 text-xs col-span-2">{errors.description}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={form.latitude}
              onChange={(e) => update("latitude", e.target.value)}
              type="number"
              step="0.000001"
              placeholder="Latitude"
              className="p-2 border rounded"
              disabled={isLoading}
            />
            <input
              value={form.longitude}
              onChange={(e) => update("longitude", e.target.value)}
              type="number"
              step="0.000001"
              placeholder="Longitude"
              className="p-2 border rounded"
              disabled={isLoading}
            />
          </div>

          {/* Caractéristiques */}
          <div>
            <label className="block text-sm font-medium mb-2">Caractéristiques</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FEATURES_OPTIONS.map((feat) => (
                <label key={feat.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.features?.includes(feat.value)}
                    onChange={() => toggleFeature(feat.value)}
                    disabled={isLoading}
                  />
                  {feat.label}
                </label>
              ))}
            </div>
          </div>

          {/* Images URLs existantes */}
          {!form.id && (
            <div>
              <label className="block text-sm font-medium mb-2">Images par URL (optionnel)</label>
              {form.images.map((img, idx) => (
                <div className="flex items-center gap-2 mb-2" key={idx}>
                  <input 
                    value={img} 
                    onChange={(e) => {
                      const imgs = [...form.images]; 
                      imgs[idx] = e.target.value; 
                      setForm(f => ({ ...f, images: imgs }));
                    }} 
                    placeholder="https://..." 
                    className="p-2 border rounded w-full text-sm" 
                    disabled={isLoading}
                  />
                  {form.images.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeExistingImage(idx)} 
                      className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  )}
                  {idx === form.images.length - 1 && (
                    <button 
                      type="button" 
                      onClick={() => setForm(f => ({ ...f, images: [...f.images, ""] }))} 
                      className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      disabled={isLoading}
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload fichiers */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Uploader des images {form.id ? '' : '(ou laisser vide et utiliser les URLs)'}
            </label>
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp"
              multiple 
              onChange={handleFileChange} 
              className="p-2 border rounded w-full text-sm"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">Maximum 15 images, formats: JPG, PNG, WebP</p>
            {fileError && <p className="text-xs text-red-600 mt-1">{fileError}</p>}
          </div>

          {/* Images existantes (édition) */}
          {form.id && hasExistingImages && (
            <div>
              <label className="block text-sm font-medium mb-2">Images existantes</label>
              <div className="grid grid-cols-3 gap-2">
                {form.images.map((url, idx) => {
                  const trimmed = url?.trim?.() ?? "";
                  if (!trimmed) return null;
                  return (
                    <div key={`${idx}-${trimmed}`} className="relative group">
                      <img
                        src={trimmed}
                        alt={`Image ${idx}`}
                        className="w-full h-24 object-cover rounded border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        disabled={isLoading}
                        title="Supprimer"
                      >
                        ✖
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">La suppression sera prise en compte à l'enregistrement.</p>
            </div>
          )}

          {/* Preview des nouvelles images uploadées */}
          {filePreviewUrls.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Aperçu ({filePreviewUrls.length} image{filePreviewUrls.length > 1 ? 's' : ''})
              </label>
              <div className="grid grid-cols-3 gap-2">
                {filePreviewUrls.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={preview.url} 
                      alt={`Preview ${idx}`} 
                      className="w-full h-24 object-cover rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className={`px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
