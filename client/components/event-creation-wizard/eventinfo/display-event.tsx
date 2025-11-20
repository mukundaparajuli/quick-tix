import { Event } from "@/types/event";
import { Calendar, MapPin } from "lucide-react";

export const DisplayEvent = ({ event }: { event: Event }) => {
    return (
        <div className="w-full max-w-xl text-left rounded-2xl p-6 bg-white space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
                {event.title}
            </h2>

            {event.description && (
                <p className="text-gray-700 leading-relaxed">
                    {event.description}
                </p>
            )}

            <div className="space-y-2 text-gray-800">
                <p className="flex gap-3">
                    <span className="font-semibold flex gap-2"><Calendar /> Date:</span>{" "}
                    {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="flex gap-3">
                    <span className="font-semibold flex gap-2"><MapPin /> Location:</span>{" "}
                    {event.location}
                </p>

                {event.capacity && (
                    <p>
                        <span className="font-semibold">👥 Capacity:</span>{" "}
                        {event.capacity}
                    </p>
                )}
            </div>

            <div className="pt-3 border-t text-sm text-gray-500 space-y-1">
                <p>
                    <span className="font-semibold">Published:</span>{" "}
                    {event.isPublished ? "Yes" : "No"}
                </p>
                <p>
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(event.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
};