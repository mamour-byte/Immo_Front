export default function PropertyLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto h-6 bg-slate-200 rounded w-1/3 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header skeleton */}
        <div className="mb-6 space-y-4">
          <div className="h-10 bg-slate-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        </div>

        {/* Image skeleton */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px]">
          <div className="lg:col-span-3 bg-slate-300 rounded-xl animate-pulse"></div>
          <div className="hidden lg:flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-300 rounded-xl h-full animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Characteristics */}
            <div className="bg-white rounded-xl p-6">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-6 animate-pulse"></div>
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded mx-auto mb-2 w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="h-12 bg-slate-200 animate-pulse"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div>
            <div className="bg-white rounded-xl p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
