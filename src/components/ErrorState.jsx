export default function ErrorState({ message }) {
  return (
    <div className="text-center text-red-600 py-10">
      <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
      <p>{message}</p>
    </div>
  );
}
