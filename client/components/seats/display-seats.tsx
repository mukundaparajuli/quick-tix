import { Seats } from "@/types/seat";
import { Section } from "@/types/section";
import SeatComponent from "./seat-component";

type Props = {
    seats: Seats[] | null;
    sections?: Section[] | null;
};

export default function DisplaySeats({ seats, sections }: Props) {
    console.log("DisplaySeats Rendered", seats);
    const availableSeats: Seats[] = seats ?? [];
    console.log("Available Seats:", availableSeats);

    // Build a map of sectionId -> sectionName for quick lookup.
    const sectionNameMap: Record<string, string> = {};
    (sections ?? []).forEach((sec) => {
        if (!sec) return;
        sectionNameMap[String(sec.id)] = sec.name || `Section ${sec.id}`;
    });

    // Group seats by section name (fallback to sectionId or "Unassigned").
    const groupedSeats: Record<string, Seats[]> = {};
    availableSeats.forEach((seat) => {
        console.log("Processing seat:", seat);
        const secKey = String(seat.sectionId ?? "unknown");
        const sectionName = sectionNameMap[secKey] ?? `Section ${secKey}`;
        if (!groupedSeats[sectionName]) groupedSeats[sectionName] = [];
        groupedSeats[sectionName].push(seat);
    });

    // Sort section keys for stable order (optional)
    const sectionKeys = Object.keys(groupedSeats).sort();

    return (
        <div>
            <h2 className="text-lg font-medium mb-3">Available Seats</h2>
            {sectionKeys.length === 0 && (
                <div className="text-sm text-slate-500">No seats available</div>
            )}

            {sectionKeys.map((sectionName) => {
                const letterGroups: Record<string, Seats[]> = {};
                groupedSeats[sectionName].forEach((seat) => {
                    const rawLabel = seat.label ?? "";
                    const first = String(rawLabel).trim().charAt(0).toUpperCase() || "#";
                    const letter = /[A-Z]/.test(first) ? first : "#";
                    if (!letterGroups[letter]) letterGroups[letter] = [];
                    letterGroups[letter].push(seat);
                });

                const letters = Object.keys(letterGroups).sort();

                return (
                    <div key={sectionName} className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-2">{sectionName}</h3>

                        {letters.map((letter) => (
                            <div key={letter} className="mb-3">
                                <div className="flex gap-2 mb-2 flex-nowrap overflow-x-auto">
                                    {letterGroups[letter]
                                        .sort((a, b) =>
                                            String(a.label).localeCompare(String(b.label), undefined, {
                                                numeric: true,
                                                sensitivity: "base",
                                            })
                                        )
                                        .map((seat) => (
                                            <SeatComponent key={seat.id} label={seat.label} />
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
