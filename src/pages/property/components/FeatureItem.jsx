export default function FeatureItem({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <div className="text-slate-600 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value || '-'}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}
