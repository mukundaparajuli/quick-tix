import { Ticket } from "lucide-react";
import LoginDialog from "./login";
import RegisterDialog from "./register";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
    return (
        <header className="h-20 w-full border-b-2 border-slate-200 px-4">
            <div className="xl:max-w-screen-xl mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3 cursor-pointer">
                    <Ticket size={40} className="text-gray-600" />
                    <h1 className="font-extrabold text-2xl text-gray-600 tracking-wide">Quick Tix</h1>
                </div>

                <div className="flex gap-3">
                    <Link href={"/login"}><Button variant="primaryOutline">Login</Button></Link>
                    <Link href={"/register"}><Button variant="primary">Register</Button></Link>
                </div>
            </div>
        </header >
    )
}