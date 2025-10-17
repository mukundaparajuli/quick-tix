"use client";

import { useEffect } from "react";
import useEventStore from "@/stores/event-store";
import { EventInfoForm } from "./event-info-form";

export default function EventInfo() {
    const event = useEventStore((state) => state.event);

    useEffect(() => {
        console.log("Hydrated event in EventInfo component:", event);
    }, [event]);

    if (!event) {
        return <EventInfoForm />;
    }

    return (
        <div>
            {JSON.stringify(event)}
        </div>
    );
}
