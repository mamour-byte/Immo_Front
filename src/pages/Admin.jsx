
// import React, { useEffect, useMemo, useState } from "react";
// import { Edit, Trash } from "lucide-react";

// // AJOUTEZ ceci EN HAUT DE VOTRE FICHIER
// const API_URL = "http://localhost:3000"; // adapté à votre backend
// const TYPE_OPTIONS = [
//   { value: "APPARTMENT", label: "Appartement" },
//   { value: "STUDIO", label: "Studio" },
//   { value: "MAISON", label: "Maison" },
//   { value: "TERRAIN", label: "Terrain" },
//   { value: "BUREAU", label: "Bureau" },
//   { value: "LOCAL_COMMERCE", label: "Local commercial" },
//   { value: "AUTRE", label: "Autre" },
// ];
// const PURPOSE_OPTIONS = [
//   { value: "VENTE", label: "Vente" },
//   { value: "LOCATION", label: "Location" },
// ];

// export default function AdminPropertiesDashboard() {
//   // STATES PRINCIPAUX
//   const [properties, setProperties] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Filtres & gestion UI
//   const [query, setQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [cityFilter, setCityFilter] = useState("");
//   const [districtFilter, setDistrictFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [sortField, setSortField] = useState("createdAt");
//   const [sortDir, setSortDir] = useState("desc");
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   const [selected, setSelected] = useState(null); // Pour edit
//   const [showForm, setShowForm] = useState(false);

//   // FONCTIONS D'AUTHENTIFICATION
//   function getJwt() {
//     return localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
//   }
//   async function fetchWithAuth(url, options = {}) {
//     const token = getJwt();
//     const isFormData = options?.body instanceof FormData;
//     const headers = {
//       ...options.headers,
//       Authorization: token ? `Bearer ${token}` : undefined,
//       ...(isFormData ? {} : { "Content-Type": "application/json" }),
//     };
//     const opts = { ...options, headers };
//     return fetch(url, opts);
//   }

//   // ==== FETCH DATA ====
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       fetchWithAuth(`${API_URL}/properties`).then((r) => r.json()),
//       fetchWithAuth(`${API_URL}/cities`).then((r) => r.json()),
//       fetchWithAuth(`${API_URL}/districts`).then((r) => r.json()),
//     ])
//       .then(([propRes, citiesRes, districtsRes]) => {
//         setProperties(propRes.items || propRes);
//         setCities(citiesRes);
//         setDistricts(districtsRes);
//         setLoading(false);
//       });
//   }, []);
  
//   function refreshData() {
//     setLoading(true);
//     fetchWithAuth(`${API_URL}/properties`)
//       .then((r) => r.json())
//       .then((data) => {
//         setProperties(data.items || data);
//         setLoading(false);
//       });
//   }
  
//   async function handleAddOrUpdate(item) {
//     const { files = [], ...dataItem } = item;
//     const isEdit = !!dataItem.id;
//     const method = isEdit ? "PATCH" : "POST";
//     const url = `${API_URL}/properties${isEdit ? "/" + dataItem.id : ""}`;
//     const body = {
//       title: dataItem.title,
//       description: dataItem.description || "",
//       purpose: dataItem.purpose,
//       type: dataItem.type,
//       price: Number(dataItem.price),
//       bedrooms: Number(dataItem.bedrooms),
//       bathrooms: Number(dataItem.bathrooms),
//       status: dataItem.status,
//       cityId: Number(dataItem.cityId) || undefined,
//       districtId: Number(dataItem.districtId) || undefined,
//       images: dataItem.images.filter((i) => !!i),
//     };
//     const resp = await fetchWithAuth(url, {
//       method,
//       body: JSON.stringify(body),
//     });
//     if (!resp.ok) {
//       const txt = await resp.text();
//       console.error("Erreur propriété:", resp.status, txt);
//       alert("Erreur lors de la sauvegarde du bien. Consulte la console.");
//       return;
//     }
//     const saved = await resp.json();

//     // Upload fichiers vers Cloudinary via backend si présents
//     if (files && files.length > 0 && saved?.id) {
//       const formData = new FormData();
//       files.forEach((file) => formData.append("images", file));
//       formData.append("propertyId", String(saved.id));
//       const uploadResp = await fetchWithAuth(`${API_URL}/properties/upload-images`, {
//         method: "POST",
//         body: formData,
//       });
//       if (!uploadResp.ok) {
//         const txt = await uploadResp.text();
//         console.error("Erreur upload images:", uploadResp.status, txt);
//         alert("Erreur lors de l'upload des images. Consulte la console.");
//       }
//     }

//     setShowForm(false);
//     setSelected(null);
//     refreshData();
//   }
  
//   async function handleDelete(id) {
//     if (!window.confirm("Confirmez-vous la suppression de ce bien ?")) return;
//     await fetchWithAuth(`${API_URL}/properties/${id}`, { method: "DELETE" });
//     refreshData();
//   }

//   function openEdit(property) {
//     setSelected(property);
//     setShowForm(true);
//   }

//   function openCreate() {
//     setSelected(null);
//     setShowForm(true);
//   }

//   // LISTES dérivées + filtrage + pagination
//   const types = useMemo(() => [...new Set(properties.map((p) => p.type))], [properties]);
//   const filteredDistricts = useMemo(
//     () => (cityFilter ? districts.filter((d) => String(d.cityId) === String(cityFilter)) : districts),
//     [districts, cityFilter]
//   );

//   const filtered = useMemo(() => {
//     let data = [...properties];
//     if (query.trim()) {
//       const q = query.toLowerCase();
//       data = data.filter(
//         (p) =>
//           String(p.id).includes(q) ||
//           (p.title ?? "").toLowerCase().includes(q) ||
//           (p.city?.name ?? "").toLowerCase().includes(q) ||
//           (p.district?.name ?? "").toLowerCase().includes(q) ||
//           (p.type ?? "").toLowerCase().includes(q)
//       );
//     }
//     if (typeFilter) data = data.filter((p) => p.type === typeFilter);
//     if (cityFilter) data = data.filter((p) => String(p.cityId) === String(cityFilter) || p.city?.id === Number(cityFilter));
//     if (districtFilter) data = data.filter((p) => String(p.districtId) === String(districtFilter) || p.district?.id === Number(districtFilter));
//     if (statusFilter) data = data.filter((p) => p.status === statusFilter);

//     data.sort((a, b) => {
//       const aVal = a[sortField];
//       const bVal = b[sortField];
//       if (sortField === "price") {
//         return sortDir === "asc" ? aVal - bVal : bVal - aVal;
//       }
//       if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
//       return 0;
//     });
//     return data;
//   }, [properties, query, typeFilter, cityFilter, districtFilter, statusFilter, sortField, sortDir]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [filtered.length, totalPages, page]);

//   const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <header className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-semibold">Tableau de bord — Biens immobiliers</h1>
//             <p className="text-sm text-gray-600">Gérez, filtrez et exportez vos annonces</p>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={openCreate}
//               className="px-4 py-2 bg-rose-500 text-white rounded-lg shadow hover:bg-rose-500 transition"
//             >+ Ajouter un bien</button>
//           </div>
//         </header>
//         {/* Filtres */}
//         <div className="bg-white shadow p-4 rounded-lg mb-6 border border-slate-200">
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//             <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher par titre, ville..." className="col-span-2 p-2 border rounded" />
//             <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="p-2 border rounded">
//               <option value="">Tous types</option>
//               {TYPE_OPTIONS.map((t) => (
//                 <option key={t.value} value={t.value}>{t.label}</option>
//               ))}
//             </select>
//             <select value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setDistrictFilter(""); }} className="p-2 border rounded">
//               <option value="">Toutes villes</option>
//               {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//             <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="p-2 border rounded">
//               <option value="">Tous quartiers</option>
//               {filteredDistricts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//             </select>
//             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
//               <option value="">Tous statuts</option>
//               <option value="Publie">Publié</option>
//               <option value="Brouillon">Brouillon</option>
//               <option value="Retire">Retiré</option>
//             </select>
//           </div>
//         </div>
//         {/* Table des biens */}
//         <section className="bg-white rounded shadow p-4">
//           <h2 className="font-medium mb-4">Liste des biens ({filtered.length})</h2>
//           {loading ? (<div>Chargement...</div>) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-slate-900 text-white">
//                   <tr>
//                     <th className="p-3">ID</th>
//                     <th className="p-3">Titre</th>
//                     <th className="p-3">Ville</th>
//                     <th className="p-3">Quartier</th>
//                     <th className="p-3">Prix</th>
//                     <th className="p-3">Type</th>
//                     <th className="p-3">Statut</th>
//                     <th className="p-3">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pageData.map((p) => (
//                     <tr key={p.id} className="border-t">
//                       <td className="p-3">{p.id}</td>
//                       <td className="p-3">{p.title}</td>
//                       <td className="p-3">{p.city?.name || ""}</td>
//                       <td className="p-3">{p.district?.name || ""}</td>
//                       <td className="p-3">{p.price?.toLocaleString()}</td>
//                       <td className="p-3">{p.type}</td>
//                       <td className="p-3">
//                         {p.status === "AVAILABLE" ? (
//                           <span className="px-2 py-1 bg-green-500 text-white rounded">Disponible</span>
//                         ) : p.status === "UNDER_OFFER" ? (
//                           <span className="px-2 py-1 bg-yellow-500 text-white rounded">En attente d'offre</span>
//                         ) : p.status === "ARCHIVED" ? (
//                           <span className="px-2 py-1 bg-red-500 text-white rounded">Archivé</span>
//                         ) : p.status === "SOLD" ? (
//                           <span className="px-2 py-1 bg-red-500 text-white rounded">Vendu</span>
//                         ) : p.status === "RENTED" ? (
//                           <span className="px-2 py-1 bg-blue-500 text-white rounded">Loué</span>
//                         ) : null}

//                       </td>
//                       <td className="p-3">
//                         <Edit className="text-blue-500" onClick={() => openEdit(p)} />
//                         <Trash className="text-red-500" onClick={() => handleDelete(p.id)} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {/* Pagination */}
//               <div className="mt-4 flex items-center justify-between">
//                 <div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
//                 <div className="flex gap-2">
//                   <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1 border rounded">Première</button>
//                   <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded">Préc</button>
//                   <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded">Suiv</button>
//                   <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-3 py-1 border rounded">Dernière</button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* Modale formulaire */}
//         {showForm && (
//           <PropertyForm
//             initial={selected}
//             onCancel={() => { setShowForm(false); setSelected(null); }}
//             onSubmit={handleAddOrUpdate}
//             cities={cities}
//             districts={districts}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// // ---- FORMULAIRE ADD/EDIT ---
// function PropertyForm({ initial = null, onCancel, onSubmit, cities, districts }) {
//   const [form, setForm] = useState(() => ({
//     id: initial?.id ?? null,
//     title: initial?.title ?? "",
//     description: initial?.description ?? "",
//     purpose: initial?.purpose ?? "VENTE",
//     type: initial?.type ?? "APPARTMENT",
//     price: initial?.price ?? "",
//     bedrooms: initial?.bedrooms ?? "",
//     bathrooms: initial?.bathrooms ?? "",
//     status: initial?.status ?? "Brouillon",
//     cityId: initial?.cityId || initial?.city?.id || "",
//     districtId: initial?.districtId || initial?.district?.id || "",
//     images: (initial?.images ?? []).map((img) => img?.url).filter(Boolean) || [""],
//   }));
//   const [files, setFiles] = useState([]);

//   // Gérer le filtrage dynamique des quartiers
//   const filteredDistricts = useMemo(
//     () => (form.cityId ? districts.filter((d) => String(d.cityId) === String(form.cityId)) : districts),
//     [districts, form.cityId]
//   );

//   function update(key, val) {
//     setForm((f) => ({ ...f, [key]: val }));
//   }

//   function updateImage(idx, val) {
//     setForm((f) => {
//       const imgs = [...f.images];
//       imgs[idx] = val;
//       return { ...f, images: imgs };
//     });
//   }
//   function addImageField() {
//     setForm((f) => ({ ...f, images: [...f.images, ""] }));
//   }
//   function removeImageField(idx) {
//     setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
//   }

//   function submit(e) {
//     e.preventDefault();
//     if (!form.title || !form.cityId || !form.type || !form.price || !form.purpose) {
//       alert("Merci de remplir tous les champs obligatoires (titre, ville, type, prix, objectif).");
//       return;
//     }
//     onSubmit({ ...form, files });
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
//       <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
//       <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
//         <form onSubmit={submit} className="space-y-4">
//           <h3 className="text-lg font-medium">{form.id ? "Modifier le bien" : "Nouveau bien"}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Titre *" className="p-2 border rounded" />
//             <select value={form.purpose} onChange={(e) => update("purpose", e.target.value)} className="p-2 border rounded">
//               <option value="">Objectif *</option>
//               {PURPOSE_OPTIONS.map((p) => (
//                 <option key={p.value} value={p.value}>{p.label}</option>
//               ))}
//             </select>
//             <select value={form.type} onChange={(e) => update("type", e.target.value)} className="p-2 border rounded">
//               <option value="">Type *</option>
//               {TYPE_OPTIONS.map((t) => (
//                 <option key={t.value} value={t.value}>{t.label}</option>
//               ))}
//             </select>
//             <select value={form.cityId} onChange={(e) => { update("cityId", e.target.value); update("districtId", ""); }} className="p-2 border rounded">
//               <option value="">Ville *</option>
//               {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//             <select value={form.districtId} onChange={(e) => update("districtId", e.target.value)} className="p-2 border rounded">
//               <option value="">Quartier</option>
//               {filteredDistricts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//             </select>
//             <input value={form.price} type="number" onChange={(e) => update("price", e.target.value)} placeholder="Prix (XOF) *" className="p-2 border rounded" />
//             <input value={form.bedrooms} type="number" onChange={(e) => update("bedrooms", e.target.value)} placeholder="Chambres" className="p-2 border rounded" />
//             <input value={form.bathrooms} type="number" onChange={(e) => update("bathrooms", e.target.value)} placeholder="Salles de bain" className="p-2 border rounded" />
//             <select value={form.status} onChange={(e) => update("status", e.target.value)} className="p-2 border rounded">
//               <option value="Publie">Publié</option>
//               <option value="Brouillon">Brouillon</option>
//               <option value="Retire">Retiré</option>
//             </select>
//             <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Description" className="p-2 border rounded col-span-1 md:col-span-2" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Images (URL, une par champ):</label>
//             {form.images.map((img, idx) => (
//               <div className="flex items-center gap-2 mb-1" key={idx}>
//                 <input
//                   value={img}
//                   onChange={(e) => updateImage(idx, e.target.value)}
//                   placeholder="https://..."
//                   className="p-2 border rounded w-full"
//                 />
//                 {form.images.length > 1 && (
//                   <button type="button" onClick={() => removeImageField(idx)} className="px-2 py-1 text-xs rounded bg-gray-200">-</button>
//                 )}
//                 {idx === form.images.length - 1 && (
//                   <button type="button" onClick={addImageField} className="px-2 py-1 text-xs rounded bg-gray-200">+</button>
//                 )}
//               </div>
//             ))}
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Uploader des images (Cloudinary) :</label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={(e) => setFiles(Array.from(e.target.files || []))}
//               className="p-2 border rounded w-full"
//             />
//             {files.length > 0 && (
//               <div className="text-sm text-gray-600 mt-1">{files.length} fichier(s) prêt(s) à être envoyé(s)</div>
//             )}
//           </div>
//           <div className="flex justify-end gap-2">
//             <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Annuler</button>
//             <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded">Enregistrer</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }