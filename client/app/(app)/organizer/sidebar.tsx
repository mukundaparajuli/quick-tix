import { cn } from "@/lib/utils"
import Link from "next/link"
import SidebarItem from "./sidebar-item"
import { Ticket } from "lucide-react"

type Props = {
    className?: string
}
export default function Sidebar({ className }: Props) {
    return (
        <div className={cn("flex lg:fixed h-full  lg:w-[256px] border-r-2 px-1 top-0 left-0 flex-col", className)}>
            <Link href="/organizer">
                <div className="pt-4 pl-4 pb-4 flex items-center gap-x-3 cursor-pointer">
                    <Ticket size={40} className="text-gray-600" />
                    <h1 className="font-extrabold text-2xl text-gray-600 tracking-wide">Quick Tix</h1>
                </div>
            </Link>
            <div className="flex flex-col flex-1 gap-y-2">
                <SidebarItem
                    href="/organizer"
                    iconName="dashboard"
                    label="Dashboard"
                />
                <SidebarItem
                    href="/organizer/event"
                    iconName="calendarDays"
                    label="Events"
                />
                <SidebarItem
                    href="/organizer/bookings"
                    iconName="ticket"
                    label="Bookings"
                />
                <SidebarItem
                    href="/organizer/wallet"
                    iconName="wallet"
                    label="Wallet"
                />
                <SidebarItem
                    href="/organizer/profile"
                    iconName="user"
                    label="Profile"
                />
            </div>
        </div>
    )
}