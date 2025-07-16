"use client";

import { eventsMenu } from "@/constants/events-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSignOutAlt, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { ModeToggle } from "@/components/themes";
import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "../../../../../assets/Logo.png"
export default function Header() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogOut = () => {
        signOut();
        toast.success("Logged out successfully!");
        setIsMenuOpen(false);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <header className={`fixed z-50 top-0 left-0 w-full transition-all duration-300 ${isScrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md"
            : "bg-white dark:bg-gray-800"
            }`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1
                            className="text-2xl md:text-3xl font-bold cursor-pointer hover:opacity-80 transition-opacity flex justify-center items-center"
                            onClick={() => router.replace("/")}
                        >
                            <Image
                                src={Logo}
                                alt="Quick Tix"
                                height={70}
                            />
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <nav className="flex items-center space-x-6">
                            {eventsMenu.map((item) => (
                                <Link
                                    href={item.path}
                                    key={item.name}
                                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-4 ml-4">
                            <ModeToggle />

                            {session?.user ? (
                                <>
                                    <button
                                        onClick={() => router.push("/profile")}
                                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <FaUser className="text-lg" />
                                        <span className="font-medium">{session.user.name}</span>
                                    </button>
                                    <button
                                        onClick={handleLogOut}
                                        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                                    >
                                        <FaSignOutAlt />
                                        <span>Log Out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <ModeToggle />
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                            aria-label="Main menu"
                        >
                            {isMenuOpen ? (
                                <FaTimes className="h-6 w-6" />
                            ) : (
                                <FaBars className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {eventsMenu.map((item) => (
                            <Link
                                href={item.path}
                                key={item.name}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {session?.user ? (
                            <>
                                <button
                                    onClick={() => {
                                        router.push("/profile");
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FaUser className="mr-2" />
                                    {session.user.name}
                                </button>
                                <button
                                    onClick={handleLogOut}
                                    className="w-full flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                                >
                                    <FaSignOutAlt className="mr-2" />
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 text-center transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}