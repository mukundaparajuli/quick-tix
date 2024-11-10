"use client";

import Image from "next/image";
import { bannerImageSrc, bannerSearchMenu } from "@/constants/banner-search-menu";
import { FaSearch } from "react-icons/fa";

export default function Banner() {
    return <div className="w-full flex items-center justify-center mt-40">
        <div>
            <Image src={bannerImageSrc} alt="banner" width={1400} height={800} className="rounded-3xl shadow-xl" />

            <div className="absolute top-80 left-0 w-full h-full flex items-center justify-center gap-8 shadow-xl">
                <div className="bg-black/50 rounded-full p-8 flex gap-8 border-2 border-slate-500 justify-between items-center">
                    {bannerSearchMenu.map((item, index) => (
                        <>
                            <div key={index} className="flex flex-col items-start justify-between text-white cursor-pointer hover:scale-105 transition-all duration-300">
                                <h1 className="text-xl font-semibold">{item.searchHeader}</h1>
                                <p className="text-lg text-gray-300">{item.searchSubHeader}</p>
                            </div>
                            {index !== bannerSearchMenu.length - 1 && (
                                <div className="w-[2px] h-16 bg-gray-500"></div>
                            )}
                        </>
                    ))}
                    <div className="relative bg-white rounded-full flex items-center justify-center p-5 cursor-pointer hover:scale-105 transition-all duration-300">
                        <FaSearch className="text-black text-2xl" />
                    </div>
                </div>
            </div>
        </div>

    </div>
}