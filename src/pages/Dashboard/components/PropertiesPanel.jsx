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
  useFeatures,
} from "../../Admin/hooks/useProperties";
import { uploadProperty3DAsset } from "../../Admin/services/propertiesApi";
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
  const { data: features } = useFeatures();

  const { data: propsData, isLoading, isError } = listQuery;
  const items = Array.isArray(propsData) ? propsData : (propsData?.items ?? []);
  const total = propsData?.total ?? (Array.isArray(propsData) ? propsData.length : items.length);
  const totalPages = Math.max(1, Math.ceil(total / (filters.pageSize || 10)));
  const featureOptions = Array.isArray(features)
    ? features.map((feature) => ({ value: feature.id, label: feature.name }))
    : [];

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
    const { files, assets3D, ...body } = payload;

    // Separate 3D files from other assets
    const glbFiles = assets3D?.filter(asset => asset.provider === 'glb' && asset.file) || [];
    const urlAssets = assets3D?.filter(asset => asset.provider !== 'glb' || !asset.file) || [];

    // Create/update property with URL-based 3D assets
    const propertyPayload = {
      ...body,
      assets3D: urlAssets.length > 0 ? urlAssets : undefined,
    };

    if (!body.id && files && files.length > 0) {
      createWithImagesMutation.mutate(
        { payload: propertyPayload, files },
        {
          onSuccess: async (createdProperty) => {
            const propertyId = createdProperty?.data?.id ?? createdProperty?.id;
            // Upload GLB files after property creation
            if (glbFiles.length > 0 && propertyId) {
              await upload3DAssets(propertyId, glbFiles);
            }
            setShowForm(false);
            setSelected(null);
          },
        },
      );
      return;
    }

    if (!body.id) {
      createMutation.mutate(propertyPayload, {
        onSuccess: async (createdProperty) => {
          // Upload GLB files after property creation
          if (glbFiles.length > 0) {
            await upload3DAssets(createdProperty.id, glbFiles);
          }
          setShowForm(false);
          setSelected(null);
        },
      });
      return;
    }

    updateMutation.mutate(
      { id: body.id, payload: propertyPayload },
      {
        onSuccess: async (saved) => {
          // Upload GLB files for existing property
          if (glbFiles.length > 0) {
            await upload3DAssets(saved.id || body.id, glbFiles);
          }
          
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

  async function upload3DAssets(propertyId, glbFiles) {
    for (const asset of glbFiles) {
      try {
        await uploadProperty3DAsset(propertyId, asset);
      } catch (error) {
        console.error("Erreur upload fichier 3D:", error);
      }
    }
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
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
      <div className="min-w-0 xl:col-span-1">
        <PropertyFilters
          filters={filters}
          setFilters={(f) => {
            setFilters((prev) => ({ ...prev, ...f, page: 1 }));
          }}
        />
      </div>

      <div className="min-w-0 xl:col-span-3">
        <section>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{title} ({total})</h2>
              {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="text-sm text-slate-600">Page {filters.page} / {totalPages}</div>
              <button
                onClick={openCreate}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Ajouter
              </button>
            </div>
          </div>

          {isError && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
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
          featureOptions={featureOptions}
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
