"use client";

import React, { useEffect, useState } from "react";
import getWithAuth from "../../../../../utils/getWithAuth";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaDownload, FaHome } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

const Success = ({ bookingId }: { bookingId: string | null }) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
    const { data: session } = useSession();

    const [bookingDetail, setBookingDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookingId) {
            setError("Invalid booking ID.");
            setLoading(false);
            return;
        }

        const fetchBookingInfo = async () => {
            try {
                setLoading(true);
                const response = await getWithAuth(
                    `${BACKEND_URL}/api/booking/${bookingId}`,
                    session
                );
                console.log(response);
                setBookingDetail(response);
            } catch (err) {
                setError("An error occurred while fetching booking details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingInfo();
    }, [bookingId, BACKEND_URL]);

    if (loading) {
        return <div className="text-center text-gray-600">Loading booking details...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!bookingDetail) {
        return <div className="text-center text-gray-600">No booking details found.</div>;
    }

    const { id, eventId, status, ticketCounts, totalPrice, seats, user } =
        bookingDetail;

    return (
        <div className="h-[90vh] flex justify-center items-center">
            <div className="min-w-2xl w-1/3 bg-white shadow-md p-6 mx-auto rounded-md ">
                <h2 className="text-2xl font-bold text-center text-green-600">
                    Payment Successful!
                </h2>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Information</h3>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium">Booking ID:</span> {id}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Event ID:</span> {eventId}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Status:</span> {status}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Tickets:</span> {ticketCounts}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Total Price:</span> ${totalPrice}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Seats:</span>{" "}
                            {seats.length > 0 ? seats.join(", ") : "No seats selected"}
                        </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">User Information</h3>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium">Username:</span> {user?.username}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Full Name:</span> {user?.fullName}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Email:</span> {user?.email}
                        </p>
                    </div>
                </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
                <Button>
                    <FaHome />
                    Dashboard
                </Button>
                <Button>
                    <FaDownload />
                    Download Ticket
                </Button>
            </div>
        </div>
    );
};

export default Success;
