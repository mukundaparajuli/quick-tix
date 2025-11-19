"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const SearchAndFilterEvents = ({
    q,
    setQ,
    category,
    setCategory,
    date,
    setDate,
}: {
    q: string;
    setQ: (q: string) => void;
    category: string;
    setCategory: (c: string) => void;
    date: string;
    setDate: (d: string) => void;
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleSearch = () => {
        const newParams = new URLSearchParams(params.toString());

        q ? newParams.set("q", q) : newParams.delete("q");
        category ? newParams.set("category", category) : newParams.delete("category");
        date ? newParams.set("date", date) : newParams.delete("date");

        router.push(`/dashboard/explore?${newParams.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-center w-full mb-6" >

            {/* TEXT SEARCH */}
            <Input
                placeholder="Search events..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="flex-1"
            />

            {/* CATEGORY */}
            <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                </SelectContent>
            </Select>

            {/* DATE */}
            <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-48"
            />

            <Button onClick={handleSearch} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                <Search className="w-4 h-4" />
            </Button>
        </div>
    );
};
