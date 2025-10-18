import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Venue } from "@/types/venue";

export default function VenueDetails({ venue }: { venue: Venue }) {
    if (!venue) return <p className="text-slate-500">Venue details not available.</p>;

    return (
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Venue Details</h2>
            <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-slate-700">{venue.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-700">Location:</span> {venue.location}</p>
                    <p><span className="font-medium text-slate-700">Capacity:</span> {venue.capacity}</p>
                </CardContent>
            </Card>
        </section>
    );
}
