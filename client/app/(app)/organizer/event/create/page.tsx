"use client";

import { useEffect, useRef } from "react";
import { MultiStepEventForm } from "@/components/event-creation-wizard/multi-step-form";
import useEventStore from "@/stores/event-store";
import { usePathname } from "next/navigation";

export default function CreateEventPage() {
    const resetEvent = useEventStore((state) => state.resetEvent);
    const pathname = usePathname();
    const prevPathRef = useRef(pathname);

    useEffect(() => {
        prevPathRef.current = pathname;
    }, [pathname]);

    useEffect(() => {
        return () => {
            if (prevPathRef.current !== pathname) {
                resetEvent();
            }
        };
    }, [pathname, resetEvent]);

    return (
        <div className="p-4 text-center w-3xl max-w-screen mx-auto">
            <MultiStepEventForm />
        </div>
    );
}
