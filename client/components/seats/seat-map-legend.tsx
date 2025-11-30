export default function SeatMapLegend() {
    return (
        <div className="flex items-center justify-center gap-6 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-400 border border-emerald-500 rounded" aria-hidden />
                <span className="text-sm text-slate-700">Available</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-600 border border-indigo-700 rounded" aria-hidden />
                <span className="text-sm text-slate-700">Selected</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 border border-red-600 rounded" aria-hidden />
                <span className="text-sm text-slate-700">Unavailable</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-400 border border-amber-500 rounded animate-pulse" aria-hidden />
                <span className="text-sm text-slate-700">Processing</span>
            </div>
        </div>
    );
}