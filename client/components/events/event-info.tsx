import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/event";

export default function EventInfo({ event }: { event: Event }) {
    if (!event) return <p className="text-slate-500">No event details found.</p>;

    return (
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Event Information</h2>
            <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-slate-700">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-slate-600">
                    <p>{event.description}</p>
                    <p><span className="font-medium text-slate-700">Date:</span> {event.date}</p>
                    <p><span className="font-medium text-slate-700">Location:</span> {event.location}</p>
                    <p><span className="font-medium text-slate-700">Status:</span> {event.isPublished ? "Published" : "Draft"}</p>
                </CardContent>
            </Card>
        </section>
    );
}
