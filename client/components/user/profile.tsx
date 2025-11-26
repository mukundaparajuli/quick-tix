"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge, LogOut, Shield, User } from "lucide-react";
import { Button } from "../ui/button";
import useAuthStore from "@/stores/auth-store";
import useGetUserDetails from "@/hooks/user/use-get-profile";
import { User as UserType } from "@/types/user";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function Profile() {
    const userId = useAuthStore((state) => state.user?.id);
    const { data, isFetching, isError } = useGetUserDetails();

    const user: UserType = data?.data;
    console.log("User Data:", user);
    if (isFetching) return <div>Loading profile...</div>;
    if (isError) return <div>Error loading profile</div>;
    const handleLogout = () => {
        window.location.href = "/login";
    };
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.attendeeProfile?.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gray-600 text-white">
                                {user.name?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>
                        {user.name.split(" ")[0]}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.attendeeProfile?.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gray-600 text-white">
                                {user.name?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Link
                            href="/dashboard/profile"
                            className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Edit Profile
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-full text-left text-sm text-gray-700 bg-gray-100 hover:text-red-600 hover:bg-gray-200"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    )
}