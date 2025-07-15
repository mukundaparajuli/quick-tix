import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import moment from "moment";
import { cn } from "@/lib/utils";

export default function EventCard({ event }: { event: any }) {
    const router = useRouter();

    return (
        <Card
            className={cn(
                "w-80 h-auto",
                "group relative cursor-pointer",
                "bg-white dark:bg-gray-900",
                "rounded-2xl overflow-hidden",
                "shadow-lg hover:shadow-2xl dark:shadow-xl dark:hover:shadow-2xl",
                "transition-all duration-500 ease-out",
                "border border-gray-100 dark:border-gray-800",
                "backdrop-blur-sm"
            )}
            onClick={() => router.push(`/dashboard/event/${event.id}`)}
        >
            {/* Image Section */}
            <CardHeader className="p-0 relative overflow-hidden">
                <div className="relative w-full h-48 overflow-hidden">
                    {event.images && event.images.length > 0 ? (
                        <Image
                            alt={event.title}
                            src={event.images[0]}
                            fill
                            className={cn(
                                "object-cover transition-all duration-700 ease-out",
                                "group-hover:scale-110 group-hover:brightness-110"
                            )}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                                    <FaCalendarAlt className="text-white text-lg" />
                                </div>
                                <span className="text-white text-sm font-medium opacity-90">
                                    No Image Available
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Dynamic gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
            </CardHeader>

            {/* Content Section */}
            <CardContent className="p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900" />

                <div className="relative z-10">
                    {/* Title */}
                    <h2 className={cn(
                        "text-xl font-bold mb-3 line-clamp-2",
                        "text-gray-900 dark:text-white",
                        "group-hover:text-blue-600 dark:group-hover:text-blue-400",
                        "transition-colors duration-300"
                    )}>
                        {event.title}
                    </h2>

                    {/* Date */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-sm" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {moment(event.date).format("MMM Do, YYYY")}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {moment(event.date).format("dddd")}
                            </p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <FaMapMarkerAlt className="text-red-500 dark:text-red-400 text-sm" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {event.location?.city || "Location TBD"}
                            </p>
                            {event.location?.venue && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {event.location.venue}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category Badge */}
                    <div className="flex items-center justify-between">
                        <span className={cn(
                            "inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full",
                            "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
                            "shadow-lg shadow-blue-500/25",
                            "group-hover:shadow-xl group-hover:shadow-blue-500/40",
                            "transition-all duration-300",
                            "capitalize"
                        )}>
                            {event.category.toLowerCase().replace("_", " ")}
                        </span>

                        {/* Price indicator (if available) */}
                        {event.price && (
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                ${event.price}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>

            {/* Animated border on hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300" />

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
        </Card>
    );
}