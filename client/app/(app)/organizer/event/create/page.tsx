"use client";

import { useEffect, useRef } from "react";
import { MultiStepEventForm } from "@/components/event-creation-wizard/multi-step-form";
import useEventStore from "@/stores/event-store";

export default function CreateEventPage() {
    const resetEvent = useEventStore((state) => state.resetEvent);

    useEffect(() => {
        return () => {
            resetEvent();
        };
    }, [resetEvent]);

    return (
        <div className="p-4 text-center w-3xl max-w-screen mx-auto">
            <MultiStepEventForm />
        </div>
    );
}
