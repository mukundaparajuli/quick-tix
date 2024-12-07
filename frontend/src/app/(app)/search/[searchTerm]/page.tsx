"use client"

import { useParams } from "next/navigation"
import getWithAuth from "../../../../../utils/getWithAuth"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EventCard from "../../dashboard/components/EventCard";
import { EventType } from "../../../../../types/eventType";
import { SearchInput } from "../components"

const Page = () => {
    const [searchedEvents, setSearchedEvents] = useState<EventType[] | null>(null);
    const { searchTerm } = useParams();
    const { data: session } = useSession();

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const handleSearchByTerm = async () => {
        const response = await getWithAuth(`${BACKEND_URL}/api/event/search/${searchTerm}`, session);
        setSearchedEvents(response);
        console.log(searchedEvents);
    }

    useEffect(() => {
        handleSearchByTerm();
    }, [])
    console.log(searchTerm);
    return (
        <div className="content-center">
            <h1 className="font-bold text-4xl">{searchTerm}</h1>
            <SearchInput />
            {searchedEvents && searchedEvents.length >= 1 && searchedEvents.map((event) => (
                <EventCard event={event} key={event.id} />
            ))}

        </div>
    )
}

export default Page
