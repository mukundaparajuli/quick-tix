interface SeatMapHeaderProps {
    totalSeats: number;
    totalPrice: number;
}

export default function SeatMapHeader({ totalSeats, totalPrice }: SeatMapHeaderProps) {
    return (
        <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900">Select Your Seats</h2>

            {totalSeats > 0 && (
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                        {totalSeats} seat{totalSeats !== 1 ? 's' : ''} selected
                    </span>
                    <span className="font-semibold text-gray-900">
                        ${totalPrice.toFixed(2)}
                    </span>
                </div>
            )}
        </div>
    );
}