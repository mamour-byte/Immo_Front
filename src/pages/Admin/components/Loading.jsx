// components/Loading.jsx
export default function Loading({ message = "Chargement..." }) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mr-4" />
        <div className="text-gray-600">{message}</div>
      </div>
    );
  }
  