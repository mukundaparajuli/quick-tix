"use client";

import Image from "next/image";
import { Event } from "@/types/event";
import { CalendarDays, MapPin, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";
import Link from "next/link";

export default function EventCard({ event }: { event: Event }) {


    return (
        <div className="w-full h-64 border-b-4 border-slate-400 active:border-b-0 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 mt-4 bg-white">
            <div className="flex flex-col md:flex-row h-full">
                <div className="relative w-full md:w-1/3 h-44 md:h-auto">
                    <Image
                        src={"/banner.jpg"}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="p-4 flex flex-col justify-between gap-y-3 flex-1 relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold truncate">{event.title}</h2>
                            <Badge
                                variant={event.isPublished ? "default" : "secondary"}
                                className={event.isPublished ? "bg-sky-600" : "bg-slate-400"}
                            >
                                {event.isPublished ? "Published" : "Draft"}
                            </Badge>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <MoreVertical className="h-5 w-5 text-slate-600" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {event.isPublished ? (

                                    <DropdownMenuItem onClick={() => console.log("Edit event")}>
                                        Edit Event
                                    </DropdownMenuItem>
                                ) : (
                                    <Link href={"/organizer/event/create/" + event.id}>
                                        <DropdownMenuItem
                                            onClick={() => console.log("Complete event creation")}
                                        >
                                            Complete Event Creation
                                        </DropdownMenuItem>
                                    </Link>
                                )}
                                <Link href={"/organizer/event/" + event.id}>
                                    <DropdownMenuItem onClick={() => console.log("View details")}>
                                        View Details
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">
                        {event.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-sm text-slate-500 mt-2">
                        <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>{event.location}</span>
                        </div>
                        <span className="text-slate-400">Capacity: {event.capacity}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
