"use client";

import { useOrganizerEvents } from "@/hooks/organizer";
import { Event } from "@/types/event";
import EventCard from "./event-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Plus } from "lucide-react";

export const AllEvents = () => {
    const { data, isLoading, isError } = useOrganizerEvents();
    const events: Event[] = data || [];

    if (isLoading)
        return <EventsPageSkeleton />;

    if (isError)
        return (
            <div className="flex justify-center items-center min-h-[40vh] text-red-500">
                Error loading events
            </div>
        );

    return (
        <section className="w-full px-4 py-10 relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-700">My Events</h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Manage all your events
                    </p>
                </div>
                <Link href="/organizer/event/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col gap-y-6 w-full">
                {events.length > 0 ? (
                    events.map((event: Event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                        <CalendarDays className="h-16 w-16 text-slate-300 mb-4" />
                        <p className="text-slate-500 text-lg mb-4">No events yet</p>
                        <p className="text-slate-400 text-sm mb-6">Create your first event to get started</p>
                        <Link href="/organizer/event/create">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Event
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

function EventsPageSkeleton() {
    return (
        <section className="w-full px-4 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex flex-col gap-y-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-64">
                        <CardContent className="p-0 h-full">
                            <div className="flex h-full">
                                <Skeleton className="w-1/3 h-full" />
                                <div className="flex-1 p-4 space-y-4">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-16 w-full" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
