interface SeatMapLegendProps {
    visible: boolean;
}

const LEGEND_ITEMS = [
    { color: "bg-emerald-400 border border-emerald-500", label: "Available" },
    { color: "bg-indigo-600 border border-indigo-700", label: "Selected" },
    { color: "bg-red-500 border border-red-600", label: "Booked" },
    { color: "bg-amber-400 border border-amber-500 animate-pulse", label: "Processing" }
];

export default function SeatMapLegend({ visible }: SeatMapLegendProps) {
    if (!visible) return null;

    return (
        <div className="mb-6 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h4 className="text-sm font-medium mb-3 text-slate-900">Seat Status</h4>
            <div className="flex flex-wrap gap-4 text-xs text-slate-700">
                {LEGEND_ITEMS.map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-sm ${color}`} aria-hidden />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}