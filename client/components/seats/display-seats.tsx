import SeatComponent from "./seat-component";

export default function DisplaySeats() {
    return (
        <div>
            <h2>Available Seats</h2>
            <div className="flex space-x-2">
                <SeatComponent label="A1" />
                <SeatComponent label="A2" />
                <SeatComponent label="A3" />
                <SeatComponent label="A4" />
            </div>
        </div>
    )
}