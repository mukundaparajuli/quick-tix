"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Compass } from "lucide-react";

export default function ExploreCTA() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const goToExplore = () => {
        query === "" ?
            router.push("/dashboard/explore") :
            router.push(`/dashboard/explore?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="w-full flex justify-end mt-6 gap-2">

            <div className="flex items-center gap-2">
                {/* Search Input */}
                <Input
                    placeholder="Search events..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-64 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                <Button
                    onClick={goToExplore}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    <Search className="w-4 h-4" />
                </Button>


                <Button
                    onClick={goToExplore}
                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-5"
                >
                    <Compass className="w-4 h-4 mr-1" />
                    Explore
                </Button>
            </div>
        </div>
    );
}
