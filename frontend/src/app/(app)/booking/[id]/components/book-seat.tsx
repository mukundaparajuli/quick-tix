"use client"

// Types for your specific data structure
interface Seat {
    id: number;
    seatNumber: string;
    status: "available" | "selected" | "locked" | "booked";
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

interface ServerToClientEvents {
    "seat-locked": (data: { seatId: number; userId?: string }) => void;
    "seat-unlocked": (data: { seatId: number }) => void;
    "seat-booked": (data: { seatId: number }) => void;
    "lock-confirmed": (data: { success: boolean; seatId: number }) => void;
    "booking-confirmed": (data: { success: boolean; message: string }) => void;
}

interface ClientToServerEvents {
    "join-event": (eventId: number) => void;
    "lock-seat": (data: { seatId: number; eventId: number }) => void;
    "unlock-seat": (data: { seatId: number; eventId: number }) => void;
    "book-seats": (data: { eventId: number; seats: number[] }) => void;
}

interface BookSeatProps {
    eventId: number;
    seatLayout: Section[];
}

import React, { useState, useEffect, useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Socket } from "socket.io-client";
import { useSocket } from "@/contexts/socketContext";
import { useSession } from "next-auth/react";

const BookSeat: React.FC<BookSeatProps> = ({ eventId, seatLayout }) => {
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
    const [layout, setLayout] = useState<Section[]>(seatLayout);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lockedSeats, setLockedSeats] = useState<Set<number>>(new Set());
    const newSocket = useSocket();
    const { data: session } = useSession();
    const userId = session?.user.id;

    // set socket only if it does not exist previously 
    useEffect(() => {
        if (!socket && newSocket) {
            setSocket(newSocket);
        }
    }, [socket, newSocket]);
    useEffect(() => {
        if (!socket) {
            console.log("no socket conenction!")
            return;
        };
        socket.emit("join-event", eventId);

        socket.on('seat-updated', (eventId, seatId, status) => {
            console.log("seat updated: ", eventId, seatId, status)
            setLockedSeats(prev => new Set([...prev, seatId]));
            updateSeatStatus(seatId, "locked");
        })

        socket.on("seat-locked", ({ seatId, userId }) => {
            console.log("locking the seat " + seatId + " for " + userId)
            setLockedSeats(prev => new Set([...prev, seatId]));
            updateSeatStatus(seatId, "locked");
        });

        socket.on("seat-unlocked", ({ seatId }) => {
            setLockedSeats(prev => {
                const newSet = new Set(prev);
                newSet.delete(seatId);
                return newSet;
            });
            updateSeatStatus(seatId, "available");
        });

        socket.on("seat-booked", ({ seatId }) => {
            updateSeatStatus(seatId, "booked");
        });

        return () => {
            socket.disconnect();
            setSocket(null);
        };
    }, []);

    const updateSeatStatus = (seatId: number, status: Seat["status"]) => {
        setLayout(prevLayout => {
            return prevLayout.map(section => ({
                ...section,
                rows: section.rows.map(row => ({
                    ...row,
                    seats: row.seats.map(seat =>
                        seat.id === seatId ? { ...seat, status } : seat
                    )
                }))
            }));
        });
    };

    const handleSeatClick = (seatId: number, sectionId: number, rowId: number) => {
        if (!socket) return;
        console.log("seat id", seatId)
        const section = layout.find(s => s.id === sectionId);
        const row = section?.rows.find(r => r.id === rowId);
        const seat = row?.seats.find(s => s.id === seatId);

        if (!seat || seat.status === "booked" || seat.status === "locked") return;

        if (seat.status === "selected") {
            socket.emit("unlock-seat", { seatId, eventId });
            updateSeatStatus(seatId, "available");
            setSelectedSeats(prev => prev.filter(s => s.seatId !== seatId));
        } else {
            console.log("selected xaina already book pani bhako xaina aba chai lock garnu paryo seat lai")
            console.log(seatId, eventId);
            socket.emit("lock-seat", Number(seatId), Number(eventId), Number(userId));

            // socket.once("lock-confirmed", ({ success, seatId }) => {
            //     console.log("seat lock-confirmed")
            //     if (success) {
            //         updateSeatStatus(seatId, "selected");
            //         setSelectedSeats(prev => [...prev, {
            //             seatId,
            //             sectionId,
            //             rowId,
            //             label: `Row ${row?.rowNumber} - Seat ${seat.seatNumber}`
            //         }]);
            //     }
            // });
            socket.on('seat-updated', ({ eventId: eventid, seatId: seatid, status }) => {
                console.log("seat updated: ", eventId, seatId, status)
                setLockedSeats(prev => new Set([...prev, seatId]));
                updateSeatStatus(seatId, "locked");
            })
        }
    };

    const getSeatColor = (status: Seat["status"]): string => {
        switch (status) {
            case "available":
                return "bg-gray-200 hover:bg-blue-200";
            case "selected":
                return "bg-blue-500 text-white";
            case "locked":
                return "bg-yellow-500 text-white cursor-not-allowed";
            case "booked":
                return "bg-gray-500 text-white cursor-not-allowed";
            default:
                return "bg-gray-200";
        }
    };

    const handleBooking = () => {
        if (!selectedSeats.length || !socket) return;

        socket.emit("book-seats", {
            eventId,
            seats: selectedSeats.map(seat => seat.seatId)
        });

        socket.once("booking-confirmed", ({ success, message }) => {
            if (success) {
                selectedSeats.forEach(seat => {
                    updateSeatStatus(seat.seatId, "booked");
                });
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
                            <div className="flex flex-col gap-4">
                                {/* Sort rows by rowNumber in descending order */}
                                {[...section.rows]
                                    .sort((a, b) => b.rowNumber - a.rowNumber)
                                    .map((row) => (
                                        <div key={row.id} className="flex items-center gap-2">
                                            <div className="w-8 text-sm font-medium">
                                                {row.rowNumber}
                                            </div>
                                            <div className="flex gap-2">
                                                {row.seats.map((seat) => (
                                                    <Button
                                                        key={seat.id}
                                                        variant="outline"
                                                        className={`w-8 h-8 p-0 flex items-center justify-center text-xs
                              ${getSeatColor(seat.status)}`}
                                                        onClick={() => handleSeatClick(seat.id, section.id, row.id)}
                                                        disabled={seat.status === "booked" || seat.status === "locked"}
                                                    >
                                                        {seat.seatNumber}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            Available
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            Selected
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            Locked
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-500 rounded"></div>
                            Booked
                        </div>
                    </div>

                    {selectedSeats.length > 0 && (
                        <div className="space-y-4">
                            <div className="text-sm">
                                Selected: {selectedSeats.map(seat => seat.label).join(", ")}
                            </div>
                            <Button onClick={handleBooking}>
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