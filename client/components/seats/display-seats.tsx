import { Seats } from "@/types/seat";
import SeatComponent from "./seat-component";

type Props = {
    seats: Seats[] | null;
}

export default function DisplaySeats({ seats }: Props) {
    return (
        <div>
            <h2>Available Seats</h2>
            <div className="flex space-x-2">
                {seats?.map((seat) => (
                    <SeatComponent key={seat.id} label={seat.label} />
                ))}
            </div>
        </div>
    )
}
