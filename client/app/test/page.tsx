"use client"

import CategoriesDisplay from "@/components/user/categories-display";
import EventsSection from "@/components/user/events-section";
import HeroSection from "@/components/user/hero-section";
import useEventStore from "@/stores/event-store";
import { useEffect } from "react";

export default function TestPage() {
    const store = useEventStore();
    useEffect(() => {
        store.resetEvent();
    }, [])
    return (
        <div className="p-4 text-center">
            <HeroSection />
            <CategoriesDisplay />
            <EventsSection />
        </div>
    )
}