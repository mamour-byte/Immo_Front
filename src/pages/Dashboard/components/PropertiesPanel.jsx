import { useState } from "react";
import {
  useProperties,
  useMyProperties,
  useCreateProperty,
  useCreatePropertyWithImages,
  useUpdateProperty,
  useDeleteProperty,
  useUploadImages,
  useCities,
  useDistricts,
} from "../../Admin/hooks/useProperties";
import PropertyFilters from "../../Admin/components/PropertyFilters";
import PropertyTable from "../../Admin/components/PropertyTable";
import PropertyForm from "../../Admin/components/PropertyForm";
import Pagination from "../../Admin/components/Pagination";

const DEFAULT_FILTERS = {
  query: "",
  type: "",
  purpose: "",
  rentalMode: "",
  cityId: "",
  districtId: "",
  status: "",
  sortField: "createdAt",
  sortDir: "desc",
  page: 1,
  pageSize: 10,
};

function PropertiesPanelBase({ title, subtitle, filters, setFilters, listQuery, showAgent }) {
  const { data: cities } = useCities();
  const { data: districts } = useDistricts();

  const { data: propsData, isLoading, isError } = listQuery;
  const items = Array.isArray(propsData) ? propsData : (propsData?.items ?? []);
  const total = propsData?.total ?? (Array.isArray(propsData) ? propsData.length : items.length);
  const totalPages = Math.max(1, Math.ceil(total / (filters.pageSize || 10)));

  const createMutation = useCreateProperty();
  const createWithImagesMutation = useCreatePropertyWithImages();
  const updateMutation = useUpdateProperty();
  const deleteMutation = useDeleteProperty();
  const uploadMutation = useUploadImages();

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

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

    if (!body.id && files && files.length > 0) {
      createWithImagesMutation.mutate(
        { payload: body, files },
        {
          onSuccess: () => {
            setShowForm(false);
            setSelected(null);
          },
        },
      );
      return;
    }

    if (!body.id) {
      createMutation.mutate(body, {
        onSuccess: () => {
          setShowForm(false);
          setSelected(null);
        },
      });
      return;
    }

    updateMutation.mutate(
      { id: body.id, payload: body },
      {
        onSuccess: (saved) => {
          if (files && files.length) {
            uploadMutation.mutate(
              { propertyId: saved.id || body.id, files },
              {
                onSuccess: () => {
                  setShowForm(false);
                  setSelected(null);
                },
              },
            );
          } else {
            setShowForm(false);
            setSelected(null);
          }
        },
      },
    );
  }

  function onPageChange(nextPage) {
    setFilters((f) => ({ ...f, page: nextPage }));
  }

  const isFormLoading =
    createMutation.isPending ||
    createWithImagesMutation.isPending ||
    updateMutation.isPending ||
    uploadMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <PropertyFilters
          filters={filters}
          setFilters={(f) => {
            setFilters((prev) => ({ ...prev, ...f, page: 1 }));
          }}
        />
      </div>

      <div className="lg:col-span-3">
        <section className="bg-white rounded shadow p-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-medium">{title} ({total})</h2>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">Page {filters.page} / {totalPages}</div>
              <button
                onClick={openCreate}
                className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-700"
              >
                + Ajouter
              </button>
            </div>
          </div>

          {isError && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700">
              Erreur lors du chargement des biens. Vérifiez la console pour plus de détails.
            </div>
          )}

          <PropertyTable
            data={items}
            loading={isLoading}
            onEdit={openEdit}
            onDelete={handleDelete}
            showAgent={showAgent}
          />

          <Pagination page={filters.page} totalPages={totalPages} onPageChange={onPageChange} />
        </section>
      </div>

      {showForm && (
        <PropertyForm
          initial={selected}
          cities={cities || []}
          districts={districts || []}
          onCancel={() => {
            setShowForm(false);
            setSelected(null);
          }}
          onSubmit={handleSubmit}
          isLoading={isFormLoading}
        />
      )}
    </div>
  );
}

function MyPropertiesPanel({ showAgent }) {
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS }));
  const listQuery = useMyProperties(filters);
  return (
    <PropertiesPanelBase
      title="Mes annonces"
      subtitle="Vous ne pouvez modifier que les biens que vous avez publiés"
      filters={filters}
      setFilters={setFilters}
      listQuery={listQuery}
      showAgent={showAgent}
    />
  );
}

function AllPropertiesPanel({ showAgent }) {
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS }));
  const listQuery = useProperties(filters);
  return (
    <PropertiesPanelBase
      title="Tous les biens"
      subtitle="Administration complète du catalogue"
      filters={filters}
      setFilters={setFilters}
      listQuery={listQuery}
      showAgent={showAgent}
    />
  );
}

export default function PropertiesPanel({ scope = "mine", showAgent = false }) {
  if (scope === "all") return <AllPropertiesPanel showAgent={showAgent} />;
  return <MyPropertiesPanel showAgent={showAgent} />;
}
