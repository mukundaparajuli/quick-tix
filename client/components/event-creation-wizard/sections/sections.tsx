import useEventStore from "@/stores/event-store"
import { useState } from "react";
import { Button } from "../../ui/button";
import { SectionForm } from "./section-form";
import DisplaySections from "./display-sections";

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


    return <DisplaySections
        addSection={addSection}
        setAddSection={setAddSection}
        venue={venue}
        sections={sections}
    />
}