"use client";

import { Event } from "@/types/event";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

export default function EventCard({
    event,
}: {
    event: Event & { media: { url: string }[] };
}) {
    const { id, title, description, date, location, media } = event;
    const imageUrl = media?.[0]?.url || "/banner.jpg";

    return (
        <Link href={"/dashboard/event/" + id} className="hover:scale-105 transition-transform">
            <div className="w-52 md:w-52 rounded-lg border flex flex-col overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={400}
                    height={240}
                    className="h-[180px] md:h-[200px] object-cover"
                />

                <div className="p-3 bg-gray-100 flex flex-col gap-2 text-start">
                    <h2 className="font-semibold text-base md:text-lg line-clamp-1">
                        {title}
                    </h2>

                    <p className="text-sm text-gray-700 line-clamp-1">{description}</p>

                    <div className="flex justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <MapPin size={14} /> {location}
                        </span>

                        <span className="flex items-center gap-1 italic">
                            <Calendar size={14} />
                            {new Date(date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
