// components/Pagination.jsx
export default function Pagination({ page, totalPages, onPageChange }) {
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
        <div className="flex gap-2">
          <button onClick={() => onPageChange(1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">1</button>
          <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Préc</button>
          <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Suiv</button>
          <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Dernière</button>
        </div>
      </div>
    );
  }
  