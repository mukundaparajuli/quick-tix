import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facility } from "@/types/facility";

export default function FacilitiesList({ facilities }: { facilities: Facility[] }) {
    if (!facilities?.length) return <p className="text-slate-500">No facilities listed.</p>;

    return (
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Facilities</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {facilities.map((f) => (
                    <Card key={f.id} className="border border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-700">{f.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600">{f.description}</CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
