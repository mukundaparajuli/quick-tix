export default function SeatComponent({ label }: { label: string }) {
    return (
        <div className="h-8 w-8 bg-gray-300 flex items-center justify-center rounded-sm">
            <span>{label}</span>
        </div>
    )
}