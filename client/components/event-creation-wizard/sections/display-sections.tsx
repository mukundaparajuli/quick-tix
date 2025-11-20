import { FC } from "react";
import { Button } from "@/components/ui/button";
import { SectionForm } from "./section-form";
import { Venue } from "@/types/venue";
import { Section } from "@/types/section";



interface DisplaySectionsProps {
    addSection: boolean;
    setAddSection: (value: boolean) => void;
    venue: Venue | null;
    sections: Section[];
}

const DisplaySections: FC<DisplaySectionsProps> = ({
    addSection,
    setAddSection,
    venue,
    sections,
}) => {
    if (addSection) {
        return <SectionForm onSuccess={() => setAddSection(false)} />;
    }

    if (!venue) {
        return <p className="text-gray-500">No venue selected.</p>;
    }

    const relatedSections = sections.filter(
        (section) => section.venueId === venue.id
    );

    return (
        <div className="space-y-4 text-left w-full max-w-xl">
            <h3 className="text-xl font-bold text-gray-900">{venue.name}</h3>

            {relatedSections.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {relatedSections.map((section) => (
                        <li key={section.id}>{section.name}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No sections added yet.</p>
            )}

            <Button onClick={() => setAddSection(true)}>Add new section</Button>
        </div>
    );
};

export default DisplaySections;
