"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { iconMap } from "@/utils/icons"

type Props = {
    label: string
    iconName: string
    href: string
}

export default function SidebarItem({ label, iconName, href }: Props) {
    const pathName = usePathname()
    // For dashboard (/organizer), use exact match; for others, use startsWith
    const isActive = href === "/organizer"
        ? pathName === href
        : pathName.startsWith(href)
    const IconComponent = iconMap[iconName]

    if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found in iconMap`)
        return null
    }

    return (
        <Button
            variant={isActive ? "sidebarOutline" : "sidebar"}
            className="justify-start h-[46px]"
            asChild
        >
            <Link href={href}>
                <IconComponent size={32} className="mr-3" />
                {label}
            </Link>
        </Button>
    )
}