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
import Image from 'next/image';

export default function BookEventPage() {
    const { id } = useParams();
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

    const eventId = id ? parseInt(id as string, 10) : 0;
    const { data: eventDetails, isFetching } = useGetEventDetails({ eventId });

    if (!id) return <div className="text-slate-500 text-center mt-10">No event ID provided</div>;

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

    const { event, sections, seats, ticketTypes, venue, facilities } = normalizeEvent(eventDetails?.data);

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

            {/* Event Images */}
            {event?.media && event.media.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {event.media.map((image, index) => (
                                    <div key={image.id} className="relative">
                                        <Image
                                            src={image.url}
                                            alt={image.altText || `Event image ${index + 1}`}
                                            width={400}
                                            height={300}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

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

            {/* Venue Details */}
            {venue && (
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Venue Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{venue.name}</h4>
                                    <p className="text-gray-600">{venue.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Venue Capacity</p>
                                    <p className="font-medium">{venue.capacity} seats</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Ticket Types and Facilities */}
            {ticketTypes && ticketTypes.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {ticketTypes.map((ticketType) => (
                                    <div key={ticketType.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900">{ticketType.name}</h4>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-green-600">Rs. {ticketType.price}</p>
                                                <p className="text-sm text-gray-500">{ticketType.sold} sold</p>
                                            </div>
                                        </div>
                                        {facilities && facilities.filter(f => f.ticketTypeId.toString() === ticketType.id).length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Included Facilities:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {facilities.filter(f => f.ticketTypeId.toString() === ticketType.id).map((facility) => (
                                                        <Badge key={facility.id} variant="secondary" className="text-xs">
                                                            {facility.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Event Details */}
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                                <Badge variant={event?.isPublished ? "default" : "secondary"} className="mb-2">
                                    {event?.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Timestamps</h4>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>Created: {event?.createdAt ? new Date(event.createdAt).toLocaleString() : 'N/A'}</p>
                                    <p>Updated: {event?.updatedAt ? new Date(event.updatedAt).toLocaleString() : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

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