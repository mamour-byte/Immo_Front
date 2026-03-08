import SimilarPropertyCard from './SimilarPropertyCard';

export default function SimilarProperties({ properties = [] }) {
  if (properties.length === 0) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Biens similaires</h2>
        <div className="text-slate-400 text-center py-12">
          Aucun bien similaire disponible dans cette région.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 sm:mt-16">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Biens similaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {properties.slice(0, 3).map((prop) => (
          <SimilarPropertyCard key={prop.id} property={prop} />
        ))}
      </div>
    </div>
  );
}
