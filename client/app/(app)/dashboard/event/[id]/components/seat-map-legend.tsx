interface SeatMapLegendProps {
    visible: boolean;
}

const LEGEND_ITEMS = [
    { color: "bg-gray-300", label: "Available" },
    { color: "bg-gray-600", label: "Selected" },
    { color: "bg-gray-400", label: "Booked" },
    { color: "bg-gray-500 animate-pulse", label: "Processing" }
];

export default function SeatMapLegend({ visible }: SeatMapLegendProps) {
    if (!visible) return null;

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium mb-3 text-gray-900">Seat Status</h4>
            <div className="flex flex-wrap gap-4 text-xs text-gray-700">
                {LEGEND_ITEMS.map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-sm ${color}`} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}