"use client";
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

// Define TypeScript interfaces
interface Seat {
    id: number;
    venueId: number;
    ticketTypeId: number;
    seatNumber: string;
    row: string | null;
    section: string | null;
    status: 'AVAILABLE' | 'BOOKED' | 'LOCKED';
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface TicketType {
    id: number;
    eventId: number;
    name: string;
    price: number;
    totalQuantity: number;
    availableQuantity: number;
    features: { description?: string;[key: string]: any } | null;
    availability: 'AVAILABLE' | 'SOLD_OUT';
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface SeatLayoutProps {
    seat: any;
    venueId: number;
    ticketTypes: TicketType[];
    onProceedToPayment: () => void;
}

const SeatLayout: React.FC<SeatLayoutProps> = ({ seat, venueId, ticketTypes, onProceedToPayment }) => {
    const [seats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const router = useRouter();
    const { theme } = useTheme();

    // get all seats
    console.log("seats", seat);
    // Group all seats by section and row (no ticket type filtering)
    const groupedSeats = useMemo(() => {
        return seats.reduce((acc, seat) => {
            const section = seat.section || 'General';
            const row = seat.row || 'No Row';
            if (!acc[section]) acc[section] = {};
            if (!acc[section][row]) acc[section][row] = [];
            acc[section][row].push(seat);
            return acc;
        }, {} as Record<string, Record<string, Seat[]>>);
    }, [seats]);

    // Create a map of ticket types for quick lookup
    const ticketTypeMap = useMemo(() => {
        return ticketTypes.reduce((acc, ticket) => {
            acc[ticket.id] = ticket;
            return acc;
        }, {} as Record<number, TicketType>);
    }, [ticketTypes]);

    // Calculate total price based on selected seats
    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((total, seatId) => {
            const seat = seats.find(s => s.id === seatId);
            if (seat) {
                const ticket = ticketTypeMap[seat.ticketTypeId];
                return total + (ticket?.price || 0);
            }
            return total;
        }, 0);
    }, [selectedSeats, seats, ticketTypeMap]);

    // Handle seat selection with ticket type validation
    const handleSeatClick = (seat: Seat) => {
        if (seat.status !== 'AVAILABLE') return;

        setSelectedSeats(prev =>
            prev.includes(seat.id)
                ? prev.filter((id) => id !== seat.id)
                : [...prev, seat.id]
        );
    };

    // Get seat appearance based on its status and ticket type
    const getSeatAppearance = (seat: Seat) => {
        if (selectedSeats.includes(seat.id)) {
            return {
                className: 'bg-primary text-primary-foreground',
                label: 'Selected'
            };
        }

        if (seat.status !== 'AVAILABLE') {
            return {
                className: seat.status === 'BOOKED'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-500 text-white',
                label: seat.status === 'BOOKED' ? 'Booked' : 'Locked'
            };
        }

        // Different colors for different ticket types when available
        const ticketTypeColors: Record<number, string> = {
            3: theme === 'dark'
                ? 'bg-green-900 hover:bg-green-800 border-green-600'
                : 'bg-green-100 hover:bg-green-200 border-green-500', // General Admission
            4: theme === 'dark'
                ? 'bg-blue-900 hover:bg-blue-800 border-blue-600'
                : 'bg-blue-100 hover:bg-blue-200 border-blue-500',    // VIP
            5: theme === 'dark'
                ? 'bg-purple-900 hover:bg-purple-800 border-purple-600'
                : 'bg-purple-100 hover:bg-purple-200 border-purple-500' // Economy
        };

        return {
            className: ticketTypeColors[seat.ticketTypeId] || (theme === 'dark'
                ? 'bg-gray-800 border-gray-600'
                : 'bg-gray-100 border-gray-300'),
            label: ticketTypeMap[seat.ticketTypeId]?.name || 'Available'
        };
    };

    return (
        <Card className="max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Venue Seat Map</CardTitle>
                <div className="text-center font-semibold text-lg mb-2 py-2 bg-gray-100 dark:bg-gray-600 rounded">Stage</div>

                {/* Updated Legend */}
                <div className="flex justify-center gap-4 mb-4 flex-wrap">
                    {/* Ticket Type Colors */}
                    {ticketTypes.map(ticket => (
                        <div key={ticket.id} className="flex items-center">
                            <div className={`w-5 h-5 mr-2 rounded-sm ${ticket.id === 3
                                ? theme === 'dark'
                                    ? 'bg-green-900 border-2 border-green-600'
                                    : 'bg-green-100 border-2 border-green-500'
                                : ticket.id === 4
                                    ? theme === 'dark'
                                        ? 'bg-blue-900 border-2 border-blue-600'
                                        : 'bg-blue-100 border-2 border-blue-500'
                                    : theme === 'dark'
                                        ? 'bg-purple-900 border-2 border-purple-600'
                                        : 'bg-purple-100 border-2 border-purple-500'
                                }`}></div>
                            <span>{ticket.name}</span>
                        </div>
                    ))}
                    {/* Status Colors */}
                    <div className="flex items-center">
                        <div className="w-5 h-5 bg-primary mr-2 rounded-sm"></div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-5 h-5 bg-red-500 mr-2 rounded-sm"></div>
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-5 h-5 bg-gray-500 mr-2 rounded-sm"></div>
                        <span>Locked</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    {/* Seat Layout - Now shows all seats */}
                    {Object.entries(groupedSeats).length > 0 ? (
                        <div className="space-y-8">
                            {Object.entries(groupedSeats).map(([section, rows]) => (
                                <div key={section} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-4 text-center border-b pb-2 dark:border-gray-700">
                                        {section} Section
                                    </h3>

                                    {Object.entries(rows).map(([row, seatsInRow]) => (
                                        <div key={row} className="mb-6">
                                            <div className="font-medium mb-2 text-center">Row {row}</div>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {seatsInRow
                                                    .sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber))
                                                    .map((seat) => {
                                                        const appearance = getSeatAppearance(seat);
                                                        return (
                                                            <Button
                                                                key={seat.id}
                                                                variant="outline"
                                                                className={`w-12 h-12 flex items-center justify-center p-0 text-sm font-medium
                                  ${appearance.className}`}
                                                                onClick={() => handleSeatClick(seat)}
                                                                disabled={seat.status !== 'AVAILABLE'}
                                                                aria-label={`Seat ${seat.seatNumber} in row ${row}, ${section} - ${appearance.label}`}
                                                                title={`${ticketTypeMap[seat.ticketTypeId]?.name || 'Unknown'} - ${appearance.label}`}
                                                            >
                                                                {seat.seatNumber}
                                                            </Button>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No seats available.</p>
                    )}

                    {/* Selected Seats Summary */}
                    {selectedSeats.length > 0 && (
                        <div className="mt-6 p-4 bg-primary-foreground dark:bg-gray-800 border rounded-lg shadow-sm sticky bottom-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h4 className="font-semibold text-lg">Your Selection:</h4>
                                    <div className="text-sm space-y-1">
                                        {selectedSeats.map((seatId) => {
                                            const seat = seats.find((s) => s.id === seatId);
                                            if (!seat) return null;
                                            const ticket = ticketTypeMap[seat.ticketTypeId];
                                            return (
                                                <div key={seatId}>
                                                    {seat.section} - Row {seat.row}, Seat {seat.seatNumber}
                                                    <span className="text-primary ml-2">({ticket?.name} - ${ticket?.price.toFixed(2)})</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="font-medium mt-2">
                                        Total: <span className="text-primary">USD {totalPrice.toFixed(2)}</span>
                                    </p>
                                </div>
                                <Button
                                    className="md:w-auto w-full py-3 text-lg"
                                    onClick={onProceedToPayment}
                                >
                                    Continue to Checkout ({selectedSeats.length} seats)
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card >
    );
};

// Dummy data (could be moved to a separate file)
// const dummyTicketTypes: TicketType[] = [
//     {
//         id: 3,
//         eventId: 3,
//         name: "General Admission",
//         price: 15,
//         totalQuantity: 100,
//         availableQuantity: 90,
//         features: { description: "Standard seating in Main section" },
//         availability: "AVAILABLE",
//         createdAt: "2025-07-14T09:42:55.000Z",
//         updatedAt: "2025-07-14T09:42:55.000Z",
//         deletedAt: null,
//     },
//     {
//         id: 4,
//         eventId: 3,
//         name: "VIP",
//         price: 30,
//         totalQuantity: 50,
//         availableQuantity: 40,
//         features: { description: "Premium seating with better view", priorityEntry: true },
//         availability: "AVAILABLE",
//         createdAt: "2025-07-14T09:42:55.000Z",
//         updatedAt: "2025-07-14T09:42:55.000Z",
//         deletedAt: null,
//     },
//     {
//         id: 5,
//         eventId: 3,
//         name: "Economy",
//         price: 10,
//         totalQuantity: 80,
//         availableQuantity: 70,
//         features: { description: "Budget-friendly seating in Balcony" },
//         availability: "AVAILABLE",
//         createdAt: "2025-07-14T09:42:55.000Z",
//         updatedAt: "2025-07-14T09:42:55.000Z",
//         deletedAt: null,
//     },
// ];

// const dummySeats: Seat[] = [
//     // Main Section (50 seats, Rows A-E, 10 seats per row)
//     ...Array.from({ length: 50 }, (_, i) => ({
//         id: i + 1,
//         venueId: 3,
//         ticketTypeId: 3,
//         seatNumber: `${(i % 10) + 1}`,
//         row: String.fromCharCode(65 + Math.floor(i / 10)),
//         section: "Main",
//         status: i % 10 < 6 ? "AVAILABLE" : i % 10 < 9 ? "BOOKED" : "LOCKED",
//         createdAt: "2025-07-14T09:42:56.000Z",
//         updatedAt: "2025-07-14T09:42:56.000Z",
//         deletedAt: null,
//     })),
//     // VIP Section (30 seats, Rows A-C, 10 seats per row)
//     ...Array.from({ length: 30 }, (_, i) => ({
//         id: i + 51,
//         venueId: 3,
//         ticketTypeId: 4,
//         seatNumber: `${(i % 10) + 1}`,
//         row: String.fromCharCode(65 + Math.floor(i / 10)),
//         section: "VIP",
//         status: i % 10 < 7 ? "AVAILABLE" : i % 10 < 9 ? "BOOKED" : "LOCKED",
//         createdAt: "2025-07-14T09:42:56.000Z",
//         updatedAt: "2025-07-14T09:42:56.000Z",
//         deletedAt: null,
//     })),
//     // Balcony Section (20 seats, Rows A-B, 10 seats per row)
//     ...Array.from({ length: 20 }, (_, i) => ({
//         id: i + 81,
//         venueId: 3,
//         ticketTypeId: 5,
//         seatNumber: `${(i % 10) + 1}`,
//         row: String.fromCharCode(65 + Math.floor(i / 10)),
//         section: "Balcony",
//         status: i % 10 < 5 ? "AVAILABLE" : i % 10 < 8 ? "BOOKED" : "LOCKED",
//         createdAt: "2025-07-14T09:42:56.000Z",
//         updatedAt: "2025-07-14T09:42:56.000Z",
//         deletedAt: null,
//     })),
// ];

export default SeatLayout;