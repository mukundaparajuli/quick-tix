"use client";

import Image from "next/image";
import { bannerImageSrc, bannerSearchMenu } from "@/constants/banner-search-menu";
import { FaClosedCaptioning, FaCut, FaSearch, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Banner() {
    const [showInputBar, setShowInputBar] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const router = useRouter();

    const handleSearch = () => {
        router.push(`/search/${searchValue}`)
    }

    return <div className="w-full flex items-center justify-center mt-40 dark:bg-gray-800 -z-10">
        <div>
            <div className="relative">
                <Image src={bannerImageSrc} alt="banner" width={1000} height={1000} className="rounded-3xl " />
                <div className="absolute inset-0 bg-gray-800/50 rounded-3xl"></div>
            </div>

            <div className="absolute top-96 left-0 w-full flex items-center justify-center gap-8 text-white">
                <div>
                    <h1 className="font-bold text-4xl">Find Your Event</h1>
                    <p>Discover Everything Exciting Near You</p>
                </div>
            </div>

            <div className="absolute top-[40rem] left-0 w-full flex items-center justify-center hover:scale-105 transition-all duration-300">
                <div className="dark:bg-gray-800/90 bg-white  rounded-full px-4 py-2 flex gap-4 border-2 border-slate-500 justify-between items-center">
                    {!showInputBar
                        ?
                        (
                            <div className="flex gap-4 justify-between items-center">
                                {bannerSearchMenu.map((item, index) => (
                                    <div className="flex justify-center items-center gap-8" key={index}>
                                        <div className="flex flex-col items-start justify-between dark:text-white cursor-pointer hover:scale-105 transition-all duration-300">
                                            <h1 className="text-md font-semibold">{item.searchHeader}</h1>
                                            <p className="text-sm dark:text-gray-300">{item.searchSubHeader}</p>
                                        </div>
                                        {index !== bannerSearchMenu.length - 1 && (
                                            <div className="w-[2px] h-16 bg-gray-500"></div>
                                        )}
                                    </div>
                                ))}
                                <div className="relative dark:bg-white bg-black dark:text-black text-white rounded-full flex items-center justify-center p-2 cursor-pointer hover:scale-105 transition-all duration-300" onClick={() => setShowInputBar(!showInputBar)}>
                                    <FaSearch className="text-2xl" />
                                </div>
                            </div>
                        )
                        : (
                            <div className="flex gap-2 px-4 py-2 w-full">
                                <Input
                                    placeholder="Search"
                                    className="py-4 h-12 w-72"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />

                                <Button onClick={handleSearch} className="h-12 py-4">
                                    <FaSearch />
                                </Button>

                                <Button onClick={() => setShowInputBar(!showInputBar)} className="h-12 py-4">
                                    <FaTimes />
                                </Button>
                            </div>
                        )}
                </div>
            </div >

        </div >
    </div>
}