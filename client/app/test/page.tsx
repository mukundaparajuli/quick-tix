"use client"

import { MultiStepEventForm } from "@/components/event-creation-wizard/multi-step-form";
import useEventStore from "@/stores/event-store";
import { useEffect } from "react";

export default function TestPage() {
    const store = useEventStore();
    useEffect(() => {
        store.resetEvent();
    }, [])
    return (
        <div className="p-4 text-center">
            <MultiStepEventForm />
        </div>
    )
}