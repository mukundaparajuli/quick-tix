"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Socket } from "socket.io-client";
import { useSocket } from "@/contexts/socketContext";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

// Types for your specific data structure
interface Seat {
    id: number;
    seatId: string;
    status: "AVAILABLE" | "SELECTED" | "LOCKED" | "BOOKED";
    rowId: number;
    createdAt: string;
    updatedAt: string;
}

interface Row {
    id: number;
    rowNumber: number;
    sectionId: number;
    seats: Seat[];
    createdAt: string;
    updatedAt: string;
}

interface Section {
    id: number;
    name: string;
    eventId: number;
    rows: Row[];
    createdAt: string;
    updatedAt: string;
}

interface SelectedSeat {
    seatId: number;
    sectionId: number;
    rowId: number;
    label: string;
}

interface BookSeatProps {
    eventId: number;
    seatLayout: Section[];
}

const BookSeat: React.FC<BookSeatProps> = ({ eventId, seatLayout }) => {
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
    const [layout, setLayout] = useState<Section[]>(seatLayout);
    const [lockedSeats, setLockedSeats] = useState<Set<number>>(new Set());
    const newSocket = useSocket();
    const { data: session } = useSession();
    const userId = Number(session?.user.id);
    const [socket, setSocket] = useState<Socket | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!socket && newSocket) setSocket(newSocket);
    }, [socket, newSocket]);

    useEffect(() => {
        if (!socket) return;

        console.log("Socket connected, joining event...");
        socket.emit("join-event", eventId);

        const handleSeatData = (data: Section[]) => {
            setLayout(data);
            console.log("Seat data received:", data);
        };

        const handleSeatUpdated = ({ seatId, status }: { seatId: number; status: Seat["status"] }) => {
            console.log("seat updated ree")
            updateSeatStatus(seatId, status);
            if (status === "LOCKED") {
                setLockedSeats((prev) => new Set([...prev, seatId]));
            }
        };

        const handleSeatBooked = ({ seatId }: { seatId: number }) => {
            updateSeatStatus(seatId, "BOOKED");
        };

        const handlePayment = (data: any) => {
            console.log(data);
            const { booking, paymentUrl } = data;

            router.replace(paymentUrl);
            console.log("payment page")

        }

        socket.on("seat-data", handleSeatData);
        socket.on("seat-updated", handleSeatUpdated);
        socket.on("seat-booked", handleSeatBooked);
        socket.on("payment-page", handlePayment);

        return () => {
            socket.off("seat-data", handleSeatData);
            socket.off("seat-updated", handleSeatUpdated);
            socket.off("seat-booked", handleSeatBooked);
        };
    }, [socket, eventId]);

    const updateSeatStatus = (seatId: number, status: Seat["status"]) => {
        console.log("updating seat status...")
        console.log(seatId, status);
        setLayout((prevLayout) =>
            prevLayout.map((section) => ({
                ...section,
                rows: section.rows.map((row) => ({
                    ...row,
                    seats: row.seats.map((seat) =>
                        seat.id === seatId ? { ...seat, status } : seat
                    ),
                })),
            }))
        );
    };

    const handleSeatClick = (seatId: number, sectionId: number, rowId: number) => {
        if (!socket) return;

        const section = layout.find((s) => s.id === sectionId);
        const row = section?.rows.find((r) => r.id === rowId);
        const seat = row?.seats.find((s) => s.id === seatId);

        if (!seat || seat.status === "BOOKED") return;

        if (seat.status === "SELECTED" || seat.status === "LOCKED") {
            socket.emit("unlock-seat", Number(seatId), Number(userId), Number(eventId));
        } else {
            socket.emit("lock-seat", Number(seatId), Number(userId), Number(eventId));

            socket.once("lock-confirmed", (success, lockedSeatId) => {
                console.log
                if (success) {
                    console.log("seat lock confirmed...")
                    console.log("locked seat id= ", lockedSeatId);
                    updateSeatStatus(lockedSeatId, "SELECTED");
                    console.log("seat status updated...")
                    setSelectedSeats((prev) => [
                        ...prev,
                        {
                            seatId: lockedSeatId,
                            sectionId,
                            rowId,
                            label: `Row ${row?.rowNumber} - Seat ${seat.seatId}`,
                        },
                    ]);
                }
            });
        }
    };

    const getSeatColor = useCallback(
        (status: Seat["status"]): string =>
            clsx({
                "bg-gray-200 hover:bg-blue-200": status === "AVAILABLE",
                "bg-blue-500 text-white": status === "SELECTED",
                "bg-yellow-500 text-white cursor-not-allowed": status === "LOCKED",
                "bg-gray-500 text-white cursor-not-allowed": status === "BOOKED",
            }),
        []
    );

    const handleBooking = () => {
        if (!selectedSeats.length || !socket) return;



        console.log("handling booking");
        console.log(selectedSeats);

        socket.emit("book-seat",
            eventId,
            selectedSeats,
            userId
        );

        socket.once("booking-confirmed", ({ success }) => {
            if (success) {
                selectedSeats.forEach((seat) => updateSeatStatus(seat.seatId, "BOOKED"));
                setSelectedSeats([]);
            }
        });
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Select Your Seats</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center space-y-8">
                    <div className="w-3/4 h-8 bg-gray-300 rounded-lg flex items-center justify-center text-sm">
                        SCREEN
                    </div>
                    {layout.map((section) => (
                        <div key={section.id} className="w-full">
                            {[...section.rows]
                                .sort((a, b) => b.rowNumber - a.rowNumber)
                                .map((row) => (
                                    <div key={row.id} className="flex items-center gap-2">
                                        <div className="w-8 text-sm font-medium">{row.rowNumber}</div>
                                        <div className="flex gap-2">
                                            {row.seats.map((seat) => (
                                                <Button
                                                    key={seat.id}
                                                    variant="outline"
                                                    className={`w-8 h-8 p-0 flex items-center justify-center text-xs ${getSeatColor(seat.status)}`}
                                                    onClick={() => handleSeatClick(seat.id, section.id, row.id)}
                                                    disabled={seat.status === "BOOKED"}
                                                >
                                                    {seat.seatId}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            AVAILABLE
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            SELECTED
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            LOCKED
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-500 rounded"></div>
                            BOOKED
                        </div>
                    </div>
                    {selectedSeats.length > 0 && (
                        <div className="space-y-4">
                            <div className="text-sm">
                                Selected: {selectedSeats.map((seat) => seat.label).join(", ")}
                            </div>
                            <Button onClick={handleBooking} className="bg-red-500 text-white">
                                Book Selected Seats
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default BookSeat;
