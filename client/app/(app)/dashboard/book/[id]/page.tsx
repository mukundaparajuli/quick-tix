"use client";

import React, { useState } from 'react';
import useGetEventDetails from "@/hooks/events/use-get-event-details";
import { normalizeEvent } from "@/utils/normalize-event-details";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import DisplaySeats from "./display-seats";
import PaymentModal from '@/components/payment/payment-modal';
import { SelectedSeat } from '@/hooks/use-seat-selection';

export default function BookEventPage() {
    const { id } = useParams();
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

    if (!id) return <div className="text-slate-500 text-center mt-10">No event ID provided</div>;

    const { data: eventDetails, isFetching } = useGetEventDetails({ eventId: +id });

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <div className="text-slate-500">Loading event details...</div>
                </div>
            </div>
        );
    }

    const { event, sections, seats, ticketTypes } = normalizeEvent(eventDetails?.data);

    const handleSelectionChange = (seats: SelectedSeat[]) => {
        setSelectedSeats(seats);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Event Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 truncate">
                                {event?.title}
                            </h1>
                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <CalendarDays className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                    {event?.date ? new Date(event.date).toLocaleString() : 'Date TBD'}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                    {event?.location || 'Venue TBD'}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <Users className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                    {event?.capacity ? `${event.capacity} seats` : 'Capacity TBD'}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <Badge variant="outline" className="text-green-600 border-green-600">
                                Available for Booking
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Description */}
            {event?.description && (
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>About This Event</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 leading-relaxed">{event.description}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Seat Selection */}
            <div className="max-w-7xl mx-auto px-4 pb-6 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Select Your Seats</CardTitle>
                        <p className="text-sm text-gray-600">
                            Choose your preferred seats from the available options below.
                        </p>
                    </CardHeader>
                    <CardContent>
                        {seats && sections && ticketTypes ? (
                            <DisplaySeats
                                seats={seats}
                                sections={sections}
                                ticketTypes={ticketTypes}
                                onSelectionChange={handleSelectionChange}
                            />
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No seats available for this event.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Payment Modal */}
            <PaymentModal />

            {/* Selection Summary (if seats selected) */}
            {selectedSeats.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 p-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
                            </div>
                            <div className="text-lg font-semibold">
                                Rs. {selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}