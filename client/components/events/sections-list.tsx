import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Section } from "@/types/section";

export default function SectionsList({ sections }: { sections: Section[] }) {
    if (!sections?.length) return <p className="text-slate-500">No sections found.</p>;

    return (
        <div className="grid gap-4">
            {sections.map((sec) => (
                <Card key={sec.id} className="bg-slate-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-100">{sec.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-400 space-y-1">
                        <p>Capacity: {sec.capacity}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
