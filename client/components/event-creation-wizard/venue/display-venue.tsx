import { FC } from "react";
import { VenueForm } from "./venue-form";
import { Venue } from "@/types/venue";

interface DisplayVenueProps {
    venue: Venue | null;
}

const DisplayVenue: FC<DisplayVenueProps> = ({ venue }) => {
    if (!venue) {
        return <VenueForm />;
    }

    return (
        <div className="max-w-xl p-6 text-left bg-white space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Venue Details</h2>
            <div className="pt-3 border-t text-sm text-gray-500 space-y-1" />
            <div className="space-y-2 text-gray-800">
                <p>
                    <span className="font-semibold">Name:</span> {venue.name}
                </p>
                <p>
                    <span className="font-semibold">Location:</span> {venue.location}
                </p>
                {venue.capacity !== undefined && (
                    <p>
                        <span className="font-semibold">Capacity:</span> {venue.capacity}
                    </p>
                )}
            </div>
        </div>
    );
};

export default DisplayVenue;
