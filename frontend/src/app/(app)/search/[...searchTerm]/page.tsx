"use client"

import { useParams, useRouter } from "next/navigation";
import getWithAuth from "../../../../../utils/getWithAuth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EventCard from "../../dashboard/components/EventCard";
import { EventType } from "../../../../../types/eventType";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaFilter, FaSearch } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { popularEventMenu } from "@/constants/events-menu";

const Page = () => {
    const { searchTerm } = useParams();
    const { data: session } = useSession();
    const router = useRouter();

    const [searchedEvents, setSearchedEvents] = useState<EventType[] | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [searchString, setSearchString] = useState<string>("");

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Sync searchString with searchTerm from useParams
    useEffect(() => {
        setSearchString(searchTerm || "");
    }, [searchTerm]);

    const handleSearchByTerm = async () => {
        if (searchString) {
            const response = await getWithAuth(
                `${BACKEND_URL}/api/event/search?searchTerm=${searchString}`,
                session
            );
            console.log(response)
            setSearchedEvents(response);
        }
    };

    const handleFilterChange = () => {
        let availableEvents = searchedEvents;
        console.log("before changing category = ", availableEvents)

        if (selectedCategory) {
            console.log(selectedCategory);
            availableEvents = availableEvents?.filter((event) =>
                event.category.includes(selectedCategory)
            );
        }

        console.log("after changing category = ", availableEvents)
        if (startDate) {
            availableEvents = availableEvents?.filter(
                (event) => new Date(event.date) >= new Date(startDate)
            );
        }

        if (endDate) {
            availableEvents = availableEvents?.filter(
                (event) => new Date(event.date) <= new Date(endDate)
            );
        }

        setSearchedEvents(availableEvents);
    };

    useEffect(() => {
        handleSearchByTerm();
    }, [searchString]);

    // Effect to trigger filtering when selectedCategory, startDate, or endDate change
    useEffect(() => {
        handleFilterChange();
    }, [selectedCategory, startDate, endDate]);

    return (
        <div className="content-center mt-28">
            {/* Search Input & Filter Section */}
            <div className="flex gap-3 justify-center">
                {/* Search Input */}
                <div className="flex items-center gap-4 bg-white shadow-md rounded-xl px-6 py-3 w-full max-w-4xl dark:bg-gray-800">
                    <div className="flex-grow">
                        <Label htmlFor="search-input" className="sr-only">
                            Search
                        </Label>
                        <Input
                            id="search-input"
                            placeholder="Search for events, items, or anything..."
                            className="w-full border-none focus:outline-none dark:bg-gray-800 dark:text-white"
                            value={searchString}
                            onChange={(e) => {
                                setSearchString(e.target.value);
                            }}
                        />
                    </div>
                    <button
                        type="button"
                        className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-all duration-300"
                        onClick={() => router.push(`/search/${searchString}`)}
                    >
                        <FaSearch />
                        <span>Search</span>
                    </button>
                </div>

                {/* Filter Button */}
                <div
                    className="flex items-center cursor-pointer rounded-xl bg-gray-300 px-6 py-3 dark:bg-gray-800 gap-3"
                    onClick={() => setShowFilter(!showFilter)}
                >
                    <FaFilter />
                    <span className="font-bold text-xl">Filter</span>
                </div>
            </div>

            {/* Filter Section: Category & Date */}
            {showFilter && (
                <div className="flex gap-4 justify-center">
                    <div className="flex items-center justify-between gap-4 bg-white shadow-md rounded-xl px-6 py-4 w-full max-w-5xl dark:bg-gray-800 mt-6">
                        {/* Category Selector */}
                        <div className="w-48">
                            <Select onValueChange={(value) => setSelectedCategory(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {popularEventMenu.map((e) => (
                                        <SelectItem value={e.category} key={e.name}>{e.category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Start Date */}
                        <div className="w-48">
                            <Label htmlFor="start-date-picker" className="sr-only">
                                Start Date
                            </Label>
                            <Input
                                id="start-date-picker"
                                type="date"
                                className="w-full border-none focus:outline-none dark:bg-gray-800 dark:text-white"
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        {/* End Date */}
                        <div className="w-48">
                            <Label htmlFor="end-date-picker" className="sr-only">
                                End Date
                            </Label>
                            <Input
                                id="end-date-picker"
                                type="date"
                                className="w-full border-none focus:outline-none dark:bg-gray-800 dark:text-white"
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Render Searched Events */}
            <div className="mt-6">
                {searchedEvents && searchedEvents.length > 0 ? (
                    searchedEvents.map((event) => (
                        <EventCard event={event} key={event.id} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No events found.</p>
                )}
            </div>
        </div>
    );
};

export default Page;
