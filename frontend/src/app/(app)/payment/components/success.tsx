"use client";

import React, { useEffect, useState } from "react";
import getWithAuth from "../../../../../utils/getWithAuth";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaDownload, FaHome } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookingDetail {
    id: string;
    eventId: string;
    status: string;
    ticketCounts: number;
    totalPrice: number;
    seats: string[];
    user: {
        username: string;
        fullName: string;
        email: string;
    };
}

const InfoRow = ({ label, value }: { label: string; value: string | number | JSX.Element }) => (
    <p className="text-gray-700">
        <span className="font-medium">{label}:</span> {value}
    </p>
);

const Success = ({ bookingId }: { bookingId: string | null }) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
    const { data: session } = useSession();
    const router = useRouter();

    const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookingId) {
            toast.error("Booking ID not available!");
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
                setBookingDetail(response);
            } catch (err) {
                setError("An error occurred while fetching booking details.");
            } finally {
                setLoading(false);
            }
        };

        toast.promise(fetchBookingInfo, {
            loading: "Loading booking details...",
            success: "Booking details loaded successfully!",
            error: "Failed to fetch booking details.",
        });

        fetchBookingInfo();
    }, [bookingId, BACKEND_URL]);

    if (loading) return <div className="text-center text-gray-600">Loading booking details...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;
    if (!bookingDetail) {
        toast.error("No booking details found.");
        return <div className="text-center text-gray-600">No booking details available.</div>;
    }

    const { id, eventId, status, ticketCounts, totalPrice, seats, user } = bookingDetail;

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-2xl bg-white shadow-md p-6 rounded-md">
                <h2 className="text-2xl font-bold text-center text-green-600">
                    Payment Successful!
                </h2>
                <div className="mt-6 space-y-6">
                    <section>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Booking Information
                        </h3>
                        <div className="space-y-2">
                            <InfoRow label="Booking ID" value={id} />
                            <InfoRow label="Event ID" value={eventId} />
                            <InfoRow label="Status" value={status} />
                            <InfoRow label="Tickets" value={ticketCounts} />
                            <InfoRow label="Total Price" value={`$${totalPrice}`} />
                            <InfoRow
                                label="Seats"
                                value={seats.length > 0 ? seats.join(", ") : "No seats selected"}
                            />
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            User Information
                        </h3>
                        <div className="space-y-2">
                            <InfoRow label="Username" value={user.username} />
                            <InfoRow label="Full Name" value={user.fullName} />
                            <InfoRow label="Email" value={user.email} />
                        </div>
                    </section>
                </div>
            </div>
            <Separator />
            <div className="flex justify-center items-center gap-4">
                <Button onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
                    <FaHome />
                    Dashboard
                </Button>
                <Button className="flex items-center gap-2">
                    <FaDownload />
                    Download Ticket
                </Button>
            </div>
        </div>
    );
};

export default Success;
