"use client";

import { useEventDetails } from "@/hooks/useEventDetails";
import { useParams } from "next/navigation";

interface TicketType {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface EventData {
    id: string;
    name: string;
    venueId: string;
    venueName?: string;
}

interface PaymentComponentProps {
    onBack: () => void;
}

export default function PaymentComponent({ onBack }: PaymentComponentProps) {
    const { id } = useParams();
    const { eventDetails, isPending, isError, error }: {
        eventDetails: any,
        isPending: boolean,
        isError: boolean,
        error: any
    } = useEventDetails(id as string);

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-[200px] animate-pulse">
                <div className="text-lg font-medium text-gray-600">Loading...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-[200px] bg-red-50 p-4 rounded-lg m-4">
                <div className="text-red-600 font-medium">Error: {error?.message}</div>
            </div>
        );
    }

    const event: EventData = eventDetails.data;
    const selectedTickets: TicketType[] = [
        { id: 1, name: "VIP", price: 1000, quantity: 2 },
        { id: 2, name: "General", price: 500, quantity: 3 },
    ];
    const totalAmount = selectedTickets.reduce(
        (acc, ticket) => acc + ticket.price * ticket.quantity,
        0
    );

    const handlePayment = (method: "khalti" | "esewa") => {
        alert(`Initiating payment with ${method} for NPR ${totalAmount}`);
    };

    return (
        <div className="p-6 sm:p-10 animate-fade-in">
            <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8 space-y-10">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">Complete Your Payment</h2>

                {/* Booking Information */}
                <section>
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Booking Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <p><span className="font-medium">Event:</span> {event.name}</p>
                        <p><span className="font-medium">Venue:</span> {event.venueName || event.venueId}</p>
                        <div className="sm:col-span-2 mt-4">
                            <h4 className="text-md font-semibold text-gray-800 mb-2">Selected Tickets</h4>
                            <ul className="space-y-2">
                                {selectedTickets.map((ticket) => (
                                    <li key={ticket.id} className="flex justify-between border-b py-1 text-gray-600">
                                        <span>{ticket.name} (x{ticket.quantity})</span>
                                        <span>NPR {(ticket.price * ticket.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Payment Amount */}
                <section>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Payment</h3>
                    <p className="text-3xl font-extrabold text-blue-600">
                        NPR {totalAmount.toFixed(2)}
                    </p>
                </section>

                {/* Payment Options */}
                <section>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Payment Method</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => handlePayment("khalti")}
                            className="flex items-center justify-center w-full sm:w-auto px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition transform hover:scale-105 shadow-lg"
                        >
                            <img src="https://khalti.com/static/img/logo1.png" alt="Khalti" className="h-6 mr-3" />
                            Pay with Khalti
                        </button>
                        <button
                            onClick={() => handlePayment("esewa")}
                            className="flex items-center justify-center w-full sm:w-auto px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition transform hover:scale-105 shadow-lg"
                        >
                            <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" className="h-6 mr-3" />
                            Pay with eSewa
                        </button>
                    </div>
                </section>

                {/* Back Button */}
                <div className="flex justify-end pt-6 border-t">
                    <button
                        onClick={onBack}
                        className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Booking
                    </button>
                </div>
            </div>
        </div>
    );
}
