"use client";

import { eventsMenu } from "@/constants/events-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSignOutAlt, FaUser } from "react-icons/fa";


export default function Header() {
    const router = useRouter();

    const { data: session } = useSession();

    return (<div className="fixed z-10 top-0 left-0 w-full h-20 bg-white dark:bg-gray-800 text-black dark:text-white flex items-center justify-between px-10 border-b-2  shadow-lg ">

        <h1 className="text-4xl font-semibold w-1/5 cursor-pointer" onClick={() => router.replace("/")}>Quick Tix</h1>


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
            (<div className="flex items-center justify-end text-lg w-1/4 cursor-pointer gap-6" >
                <div className="flex items-center justify-center gap-4  text-lg" onClick={() => router.push("/profile")}>
                    <FaUser />
                    <p>{session.user.username}</p>
                </div>
                <div onClick={() => signOut()} className="flex justify-center items-center gap-2 bg-red-500 text-white rounded-md px-4 py-2">
                    <FaSignOutAlt />
                    <p>Log Out</p>
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
