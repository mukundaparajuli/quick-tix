"use client";

import Image from "next/image";
import { Event } from "@/types/event";
import {
    CalendarDays,
    MapPin,
    MoreVertical,
    Edit,
    Eye,
    CheckCircle,
    Users,
    Clock,
    ImageIcon,
    Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";
import Link from "next/link";

export default function EventCard({ event }: { event: Event }) {
    const imageUrl = event.media?.[0]?.url || "/banner.jpg";
    const mediaCount = event.media?.length || 0;

    // Calculate days until event
    const eventDate = new Date(event.date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const getEventStatus = () => {
        if (!event.isPublished) return { label: "Draft", style: "bg-slate-200 text-slate-700" };
        if (diffDays < 0) return { label: "Completed", style: "bg-slate-800 text-white" };
        if (diffDays === 0) return { label: "Today", style: "bg-black text-white" };
        if (diffDays <= 7) return { label: "This Week", style: "bg-slate-600 text-white" };
        return { label: "Upcoming", style: "bg-slate-400 text-white" };
    };

    const status = getEventStatus();

    return (
        <Link href={`/organizer/event/${event.id}`} className="block group">
            <div className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-slate-400 hover:shadow-lg transition-all duration-300 mt-4">
                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full md:w-72 h-48 md:h-auto md:min-h-[200px] bg-slate-100 shrink-0">
                        <Image
                            src={imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Image overlay with media count */}
                        {mediaCount > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />
                                <span>{mediaCount}</span>
                            </div>
                        )}
                        {/* Status badge overlay */}
                        <div className="absolute top-3 left-3">
                            <Badge className={`${status.style} shadow-md`}>
                                {status.label}
                            </Badge>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col justify-between flex-1 min-h-[200px]">
                        {/* Header */}
                        <div>
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-slate-900 truncate group-hover:text-black transition-colors">
                                        {event.title}
                                    </h2>
                                    {diffDays >= 0 && event.isPublished && (
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {diffDays === 0
                                                ? "Happening today!"
                                                : diffDays === 1
                                                    ? "Tomorrow"
                                                    : `${diffDays} days away`}
                                        </p>
                                    )}
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full hover:bg-slate-100 shrink-0"
                                        >
                                            <MoreVertical className="h-5 w-5 text-slate-600" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <Link href={`/organizer/event/${event.id}`}>
                                            <DropdownMenuItem>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </DropdownMenuItem>
                                        </Link>

                                        <DropdownMenuSeparator />

                                        {event.isPublished ? (
                                            <Link href={`/organizer/event/${event.id}`}>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Event
                                                </DropdownMenuItem>
                                            </Link>
                                        ) : (
                                            <Link href={`/organizer/event/create/${event.id}`}>
                                                <DropdownMenuItem>
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Complete Setup
                                                </DropdownMenuItem>
                                            </Link>
                                        )}

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Event
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-slate-600 line-clamp-2 mt-3">
                                {event.description || "No description provided"}
                            </p>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-slate-400" />
                                    <span className="font-medium">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span className="truncate max-w-[150px]">{event.location}</span>
                                </div>
                                {event.capacity && (
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        <span>{event.capacity.toLocaleString()} capacity</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
