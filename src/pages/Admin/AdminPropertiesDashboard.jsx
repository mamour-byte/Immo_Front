// AdminPropertiesDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProperties, useCreateProperty, useCreatePropertyWithImages, useUpdateProperty, useDeleteProperty, useUploadImages, useCities, useDistricts } from "./hooks/useProperties";
import PropertyFilters from "./components/PropertyFilters";
import PropertyTable from "./components/PropertyTable";
import PropertyForm from "./components/PropertyForm";
import Pagination from "./components/Pagination";
import { clearSession } from "../../utils/authUtils";

export default function AdminPropertiesDashboard() {
  const navigate = useNavigate();
  // filters et pagination
  const [filters, setFilters] = useState({
    query: "",
    type: "",
    purpose: "",
    cityId: "",
    districtId: "",
    status: "",
    sortField: "createdAt",
    sortDir: "desc",
    page: 1,
    pageSize: 10,
  });

  const { data: cities } = useCities();
  const { data: districts } = useDistricts();

  const { data: propsData, isLoading, isError, error } = useProperties(filters);

  // propsData attendu : { items: [], total: N } ou tableau simple
  const items = Array.isArray(propsData) 
    ? propsData 
    : (propsData?.items ?? []);
  const total = propsData?.total ?? (Array.isArray(propsData) ? propsData.length : items.length);
  const totalPages = Math.max(1, Math.ceil(total / (filters.pageSize || 10)));

  const createMutation = useCreateProperty();
  const createWithImagesMutation = useCreatePropertyWithImages();
  const updateMutation = useUpdateProperty();
  const deleteMutation = useDeleteProperty();
  const uploadMutation = useUploadImages();

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  // Fonction de déconnexion
  function handleLogout() {
    // Utiliser la fonction utilitaire pour nettoyer complètement la session
    clearSession();
    // Rediriger vers la page de login
    navigate('/login');
  }

  function openCreate() {
    setSelected(null);
    setShowForm(true);
  }
  function openEdit(item) {
    setSelected(item);
    setShowForm(true);
  }
  function handleDelete(id) {
    if (!window.confirm("Confirmez la suppression ?")) return;
    deleteMutation.mutate(id);
  }

  async function handleSubmit(payload) {
    const { files, ...body } = payload;

    // Si c'est une création avec fichiers → utiliser la nouvelle route unifiée
    if (!body.id && files && files.length > 0) {
      createWithImagesMutation.mutate(
        { payload: body, files },
        {
          onSuccess: () => {
            setShowForm(false);
            setSelected(null);
          },
        }
      );
    }
    // Si c'est une création SANS fichiers → ancienne route
    else if (!body.id) {
      createMutation.mutate(body, {
        onSuccess: () => {
          setShowForm(false);
          setSelected(null);
        },
      });
    }
    // Si c'est une mise à jour → utiliser la route de mise à jour + upload séparé si fichiers
    else {
      updateMutation.mutate(
        { id: body.id, payload: body },
        {
          onSuccess: (saved) => {
            if (files && files.length) {
              uploadMutation.mutate({ propertyId: saved.id || body.id, files }, {
                onSuccess: () => {
                  setShowForm(false);
                  setSelected(null);
                }
              });
            } else {
              setShowForm(false);
              setSelected(null);
            }
          },
        }
      );
    }
  }

  function onPageChange(nextPage) {
    setFilters((f) => ({ ...f, page: nextPage }));
  }

  // Déterminer le loading état
  const isFormLoading = createMutation.isPending || createWithImagesMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard — Biens</h1>
            <p className="text-sm text-gray-600">Gérez vos annonces</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openCreate} className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-700">+ Ajouter</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">Déconnexion</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <PropertyFilters filters={filters} setFilters={(f) => { setFilters((prev) => ({ ...prev, ...f, page: 1 })) }} />
          </div>

          <div className="lg:col-span-3">
            <section className="bg-white rounded shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Annonces ({total})</h2>
                <div className="text-sm text-gray-600">Page {filters.page} / {totalPages}</div>
              </div>

              {isError && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700">
                  Erreur lors du chargement des biens. Vérifiez la console pour plus de détails.
                </div>
              )}
              <PropertyTable data={items} loading={isLoading} onEdit={openEdit} onDelete={handleDelete} />

              <Pagination page={filters.page} totalPages={totalPages} onPageChange={onPageChange} />
            </section>
          </div>
        </div>
      </div>

      {showForm && (
        <PropertyForm
          initial={selected}
          cities={cities || []}
          districts={districts || []}
          onCancel={() => { setShowForm(false); setSelected(null); }}
          onSubmit={handleSubmit}
          isLoading={isFormLoading}
        />
      )}
    </div>
  );
}
