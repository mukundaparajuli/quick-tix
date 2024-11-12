import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { EventType } from "../../../../../types/eventType";
import Image from "next/image";

export default function EventCard({ event, customHeight }: { event: EventType; customHeight?: string }) {
    return (
        <Card className={`dark:bg-black text-black dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-4 ${customHeight || 'h-64'} w-full`}>
            <CardHeader className="p-0">
                <Image
                    alt={event.name}
                    src={event.image}
                    height={200}
                    width={300}
                    className="rounded-t-lg object-cover h-40 w-full"
                />
            </CardHeader>
            <CardContent className="p-4">
                <h2 className="text-xl font-semibold dark:text-white text-gray-800 truncate">
                    {event.name}
                </h2>
                <p className="text-sm dark:text-slate-200 text-gray-500 mt-1">{event.category}</p>
            </CardContent>
        </Card>
    );
}
