import useEventStore from "@/stores/event-store"
import { useState } from "react";
import { Button } from "../../ui/button";
import { SectionForm } from "./section-form";

export default function Sections() {
    const [addSection, setAddSection] = useState<boolean>(false);
    const venue = useEventStore().venue;
    const sections = useEventStore().sections;

    console.log("Rendering Sections component with sections:", sections);
    console.log("Current venue:", venue);

    if (!venue) {
        return <div>Please create a venue to create a section</div>
    }

    if (!sections) {
        return <SectionForm onSuccess={() => setAddSection(false)} />
    }


    return (
        <div>
            {!addSection && venue && sections.length > 0 &&
                <div className="text-left">
                    <h3 className="font-bold text-lg">{venue.name}</h3>
                    <ul>
                        {sections && sections.filter((section) => section.venueId === venue.id).map((section) => (
                            <li key={section.id}> - {section.name}</li>
                        ))}
                    </ul>
                    <Button onClick={() => setAddSection(true)} >Add new section</Button>
                </div>
            }
            {
                addSection && <SectionForm onSuccess={() => setAddSection(false)} />
            }

        </div >
    )
}