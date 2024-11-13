"use client";

import { eventsMenu } from "@/constants/events-menu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";


export default function Header() {
    const router = useRouter();
    
    const { data: session } = useSession();

    return (<div className="fixed z-10 top-0 left-0 w-full h-20 bg-white dark:bg-black text-black dark:text-white flex items-center justify-between px-10 border-b-2  shadow-lg ">

        <h1 className="text-4xl font-semibold w-1/5">Quick Tix</h1>


        <div className="flex items-center justify-center w-3/5">
            <div className="flex items-center justify-center gap-8  text-lg w-full">
                {
                    eventsMenu.map((item) => (
                        <Link href={item.path} key={item.name} className="hover:text-blue-500 hover:scale-105 transition-all duration-300">
                            {item.name}
                        </Link>
                    ))
                }
            </div>
        </div>


        {session?.user ?
            (<div className="flex items-center justify-end text-lg w-1/4 cursor-pointer" >
                <div className="flex items-center justify-center gap-4  text-lg">
                    <FaUser />
                    <p>{session.user.username}</p>
                </div>
            </div>) :
            (< div className="flex items-center justify-end text-lg w-1/5 gap-4">
                <Link href="/login" className="flex items-center justify-center gap-4 text-xl cursor-pointer" > Sign In</Link>
                <Link href="/register" className="flex items-center justify-center gap-4  text-xl  rounded-full px-4 py-2 bg-blue-700 cursor-pointer"> Sign Up</Link>
            </div>)
        }
    </div >
    )
}