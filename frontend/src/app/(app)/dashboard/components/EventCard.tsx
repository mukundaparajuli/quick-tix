import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { EventType } from "../../../../../types/eventType";
import Image from "next/image";
import { FaCalendar, FaLocationArrow, FaMap, FaMapMarkedAlt, FaMapMarker, FaMapMarkerAlt, FaSearchLocation } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { dummyEventData } from "@/constants/dummy-event-data";
import moment from "moment"

export default function EventCard({ event }: { event: EventType }) {
    const router = useRouter();
    return (
        <Card className="dark:bg-gray-800 text-black dark:text-white h-auto shadow-lg hover:shadow-2xl scale-95 transition-all duration-300 p-0 w-[22vw] border-none m-0 cursor-pointer hover:scale-105"
            onClick={() => { router.replace('dashboard/event/' + event.id) }}>
            {event && dummyEventData &&
                <CardHeader className="p-0">
                    {dummyEventData[event?.id]?.image && <Image
                        alt="Event Name"
                        src={dummyEventData[event?.id]?.image}
                        width={1400}
                        height={1000}
                        className="rounded-t-lg object-cover h-[100%] w-auto"
                    />}
                </CardHeader>}
            <CardContent className="p-4 dark:bg-white bg-black rounded-b-lg">
                <h2 className="text-xl font-semibold text-white dark:text-gray-800 truncate">
                    {event.title}
                </h2>
                <p className="text-sm text-slate-200 dark:text-gray-700 flex cursor-pointer items-center mt-1 gap-2 font-semibold">
                    <FaCalendar />
                    <span>{moment(event.date).format('MMMM Do YYYY, h:mm:ss a')}</span>
                </p>
                <p className="text-sm text-slate-200 dark:text-gray-700 flex  cursor-pointer items-center mt-1 gap-2 italic font-semibold">
                    <FaMapMarkerAlt />
                    <span>{event.location.city}</span>
                </p>
                <p className="text-slate-200 dark:text-gray-700">{event.id}</p>
                <p className="text-sm text-slate-200 dark:text-gray-500 mt-1">{event.category}</p>
            </CardContent>
        </Card>
    );
}
