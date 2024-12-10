import React from "react";

export default function BookingCard({ booking }: { booking: any }) {
    const { event, status, ticketCounts, totalPrice, createdAt } = booking;

    return (
        <div className="max-w-3xl w-1/2 rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300 m-4 cursor-pointer">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {event.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {event.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Category: {event.category}</span>
                    <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Tickets: {ticketCounts}</span>
                    <span>Total: ${totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <span>Status: <span className={`font-semibold ${status === "CONFIRMED" ? "text-green-500" : "text-yellow-500"}`}>{status}</span></span>
                    <span>Booked: {new Date(createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}
