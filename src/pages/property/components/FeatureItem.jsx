export default function FeatureItem({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-surface rounded-lg hover:bg-surface transition-colors">
      <div className="text-text-muted mb-2">{icon}</div>
      <div className="text-2xl font-bold text-text-main mb-1">{value || '-'}</div>
      <div className="text-sm text-text-muted">{label}</div>
    </div>
  );
}
