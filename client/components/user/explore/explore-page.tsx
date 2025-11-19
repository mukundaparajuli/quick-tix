"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SearchFilterResults from "./search-filter-results";
import { SearchAndFilterEvents } from "./search-filter";

export const ExplorePage = () => {
    const params = useSearchParams();

    const initialQ = params.get("q") || "";
    const initialCategory = params.get("category") || "";
    const initialDate = params.get("date") || "";

    const [q, setQ] = useState(initialQ);
    const [category, setCategory] = useState(initialCategory);
    const [date, setDate] = useState(initialDate);

    useEffect(() => {
        setQ(initialQ);
        setCategory(initialCategory);
        setDate(initialDate);
    }, [initialQ, initialCategory, initialDate]);

    return (
        <div className="flex flex-col items-start w-full px-2 md:px-6  bg-gray-50">
            <SearchAndFilterEvents
                q={q}
                setQ={setQ}
                category={category}
                setCategory={setCategory}
                date={date}
                setDate={setDate}
            />

            <SearchFilterResults />
        </div>
    );
};
