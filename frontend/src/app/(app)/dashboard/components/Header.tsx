"use client";

import { eventsMenu } from "@/constants/events-menu";
import Link from "next/link";
import { FaUser } from "react-icons/fa";


export default function Header() {
    return (<div className="fixed z-100 top-0 left-0 w-full h-20 bg-black flex items-center justify-between px-10 border-b-2 border-gray-700 shadow-lg">
        {/* logo */}
        <h1 className="text-4xl font-semibold text-white w-1/5">Quick Tix</h1>

        {/* some options */}
        <div className="flex items-center justify-center w-3/5">
            <div className="flex items-center justify-center gap-8 text-white text-lg w-full">
                {
                    eventsMenu.map((item) => (
                        <Link href={item.path} key={item.name} className="hover:text-blue-500 hover:scale-105 transition-all duration-300">
                            {item.name}
                        </Link>
                    ))
                }
            </div>
        </div>

        {/* TODO: display profile for logged in user and sign in/up options for not logged in users */}
        {/* <div className="flex items-center justify-end text-lg w-1/4">
        <div className="flex items-center justify-center gap-4 text-white text-lg">
            <FaUser/>
            <p>Profile</p>
        </div>
    </div> */}


        <div className="flex items-center justify-end text-lg w-1/5 gap-4">
            <div className="flex items-center justify-center gap-4 text-white text-xl cursor-pointer"> Sign In</div>
            <div className="flex items-center justify-center gap-4 text-white text-xl  rounded-full px-4 py-2 bg-blue-700 cursor-pointer"> Sign Up</div>
        </div>
    </div>);
}
