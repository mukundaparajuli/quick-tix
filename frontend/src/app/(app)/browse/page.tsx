"use client";

import { useEffect, useState } from "react";
import getWithAuth from "../../../../utils/getWithAuth";
import { useSession } from "next-auth/react";
import EventCard from "../dashboard/components/EventCard";

export default function Page() {
    const { data: session } = useSession();
    const [page, setPage] = useState<number>(1);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const getEvents = async () => {
        if (!session || !hasMore || loading) return;
        setLoading(true);
        try {
            const response = await getWithAuth(
                `${BACKEND_URL}/api/event?page=${page}&limit=5`,
                session
            );
            if (response.length === 0) {
                setHasMore(false);
            } else {
                setEvents((prev) => [...prev, ...response]);
            }
        } catch (error) {
            console.log("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        getEvents();
    }, [page, session]);

    return (
        <div className="flex flex-col overflow-x-clip flex-wrap gap-4 p-4 max-h-[400vh] overflow-y-auto">
            {events.map((event) => (
                <div className="flex-3 basis-[calc(50%_-_1rem)] md:basis-[calc(25%_-_1rem)]" key={event.id}>
                    <EventCard event={event} />
                </div>
            ))}
        </div>
    )
}
