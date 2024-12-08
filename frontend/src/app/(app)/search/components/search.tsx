import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSearch } from 'react-icons/fa';
import React, { useState } from 'react';

const Search = () => {
    const [searchTerm, setSearcTerm] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleSearch = () => {
        console.log("Search by:", { selectedCategory, startDate, endDate });

        const searchUrl = `${BACKEND_URL}/api/event/search?searchTerm=${searchTerm}&category=${selectedCategory}&from=${startDate}&to=${endDate}`
        console.log(searchUrl)
    };

    return (
        <div className="flex justify-center mt-10">
            {/* Search Bar Container */}
            <div className="flex items-center gap-4 bg-white shadow-md rounded-xl px-6 py-4 w-full max-w-4xl dark:bg-gray-800">
                {/* Search Input */}
                <div className="flex-grow">
                    <Label htmlFor="search-input" className="sr-only">
                        Search
                    </Label>
                    <Input
                        id="search-input"
                        placeholder="Search for events, items, or anything..."
                        className="w-full border-none focus:outline-none dark:bg-gray-800 dark:text-white"
                    />
                </div>


                <div className="w-48">
                    <Select onValueChange={(value) => setSelectedCategory(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="events">Events</SelectItem>
                            <SelectItem value="items">Items</SelectItem>
                            <SelectItem value="places">Places</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


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

                {/* Search Button */}
                <button
                    type="button"
                    className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all duration-300"
                    onClick={handleSearch}
                >
                    <FaSearch />
                    <span>Search</span>
                </button>
            </div>
        </div>
    );
};

export default Search;
