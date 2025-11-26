"use client";

import Profile from "@/components/user/profile";
import { Ticket } from "lucide-react";
import { redirect } from "next/navigation";

export default function Header() {
    return (
        <header className="h-16 w-full border-b-1 border-slate-200 px-4">
            <div className="xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3 cursor-pointer" onClick={() => redirect("/dashboard")}>
                    <Ticket size={40} className="text-gray-600" />
                    <h1 className="font-extrabold text-2xl text-gray-600 tracking-wide">Quick Tix</h1>
                </div>

                <div className="flex gap-3">
                    <Profile />
                </div>
            </div>
        </header >
    )
}