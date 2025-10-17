import useEventStore from "@/stores/event-store";
import { VenueForm } from "./venue-form";

export default function VenueStep() {
    const venue = useEventStore().venue;


    return (
        <div>
            {venue ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Venue Details</h2>
                    <p><strong>Name:</strong> {venue.name}</p>
                    <p><strong>Location:</strong> {venue.location}</p>
                    <p><strong>Capacity:</strong> {venue.capacity}</p>
                </div>
            ) : (
                <div>
                    <VenueForm />
                </div>
            )}
        </div>
    );
}