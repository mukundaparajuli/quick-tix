type Props = {
    label: string;
    onSelect: () => void;
};

export default function BookableSeatComponent({ label, onSelect }: Props) {
    return (
        <div className="h-12 w-12 bg-gray-300 flex items-center justify-center rounded-sm overflow-hidden" onClick={onSelect}>
            <span className="text-center text-sm truncate">{label}</span>
        </div>
    );
}
