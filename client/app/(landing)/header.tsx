import { Ticket, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 h-20 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between h-full">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-x-2 cursor-pointer">
                    <Ticket size={36} className="text-slate-800" />
                    <h1 className="font-bold text-xl text-slate-800 tracking-tight">Quick Tix</h1>
                </Link>

                {/* Navigation - Hidden on mobile */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        Events
                    </Link>
                    <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        How It Works
                    </Link>
                    <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        For Organizers
                    </Link>
                    <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        Contact
                    </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" className="hidden sm:inline-flex">
                            Login
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button>Get Started</Button>
                    </Link>

                    {/* Mobile menu button */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}