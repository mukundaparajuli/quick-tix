import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketType } from "@/types/ticket-type";

export default function TicketTypesList({ ticketTypes }: { ticketTypes: TicketType[] }) {
    if (!ticketTypes?.length) return <p className="text-slate-500">No ticket types found.</p>;

    return (
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Ticket Types</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {ticketTypes.map((ticket) => (
                    <Card key={ticket.id} className="border border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-700">{ticket.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600">
                            <p>Price: ${ticket.price}</p>
                            <p>Sold: {ticket.sold}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
