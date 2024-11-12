import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { EventType } from "../../../../../types/eventType";
import Image from "next/image";
import { FaCalendar, FaLocationArrow, FaMap, FaMapMarkedAlt, FaMapMarker, FaMapMarkerAlt, FaSearchLocation } from "react-icons/fa";

export default function EventCard({ event }: { event: EventType }) {
    return (
        <Card className="dark:bg-black text-black dark:text-white rounded-full shadow-lg hover:shadow-2xl scale-95 transition-all duration-300 p-0 w-[22vw] border-none m-0 cursor-pointer hover:scale-105">
            <CardHeader className="p-0">
                <Image
                    alt={event.name}
                    src={event.image}
                    width={1000}
                    height={1000}
                    className="rounded-t-lg object-cover h-[100%] w-[100%]"
                />
            </CardHeader>
            <CardContent className="p-4 dark:bg-white bg-black rounded-b-lg">
                <h2 className="text-xl font-semibold text-white dark:text-gray-800 truncate">
                    {event.name}
                </h2>
                <p className="text-sm text-slate-200 dark:text-gray-700 flex cursor-pointer items-center mt-1 gap-2 font-semibold">
                    <FaCalendar />
                    <span>{event.date}</span>
                </p>
                <p className="text-sm text-slate-200 dark:text-gray-700 flex  cursor-pointer items-center mt-1 gap-2 italic font-semibold">
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                </p>
                <p className="text-sm text-slate-200 dark:text-gray-500 mt-1">{event.category}</p>
            </CardContent>
        </Card>
    );
}
