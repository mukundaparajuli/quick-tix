interface SeatMapHeaderProps {
    seatCount: number;
    maxSeats: number;
    totalCost: number;
}

export default function SeatMapHeader({ seatCount, maxSeats, totalCost }: SeatMapHeaderProps) {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-medium mb-2 text-gray-900">Available Seats</h2>
            {seatCount > 0 && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="font-medium">{seatCount}</span> of {maxSeats} seats selected
                    <span className="mx-2 text-gray-400">•</span>
                    Total: <span className="font-semibold text-gray-800">${totalCost.toFixed(2)}</span>
                </div>
            )}
        </div>
    );
}