export default function SeatComponent({ label }: { label: string }) {
    return (
        <div className="h-12 w-12 bg-gray-300 flex items-center justify-center rounded-sm overflow-hidden">
            <span className="text-center text-sm truncate">{label}</span>
        </div>
    );
}
