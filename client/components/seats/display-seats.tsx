import { Seats } from "@/types/seat";
import SeatComponent from "./seat-component";

type Props = {
    seats: Seats[] | null;
};

export default function DisplaySeats({ seats }: Props) {
    console.log("DisplaySeats Rendered", seats);
    const availableSeats: Seats[] = seats ?? [];
    console.log("Available Seats:", availableSeats);
    const groupedSeats: Record<string, Seats[]> = {};
    availableSeats.forEach((seat) => {
        console.log("Processing seat:", seat);
        const firstLetter = seat.label.charAt(0).toUpperCase();
        if (!groupedSeats[firstLetter]) groupedSeats[firstLetter] = [];
        groupedSeats[firstLetter].push(seat);
    });

    return (
        <div>
            <h2>Available Seats</h2>
            {Object.keys(groupedSeats).map((letter) => (
                <div key={letter} className="flex space-x-2 mb-2">
                    {groupedSeats[letter].map((seat) => (
                        <SeatComponent key={seat.id} label={seat.label} />
                    ))}
                </div>
            ))}
        </div>
    );
}
