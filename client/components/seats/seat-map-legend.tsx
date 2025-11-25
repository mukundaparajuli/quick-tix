export default function SeatMapLegend() {
    return (
        <div className="flex items-center justify-center gap-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                <span className="text-sm text-gray-600">Available</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 border border-gray-800 rounded"></div>
                <span className="text-sm text-gray-600">Selected</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 border border-gray-500 rounded opacity-50"></div>
                <span className="text-sm text-gray-600">Unavailable</span>
            </div>
        </div>
    );
}