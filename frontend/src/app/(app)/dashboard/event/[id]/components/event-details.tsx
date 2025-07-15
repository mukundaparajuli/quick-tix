"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Event } from '../types';
import { bannerImageSrc } from '@/constants/banner-search-menu';

// Default fallback image if none provided
const defaultImage = bannerImageSrc;

const EventDetailsPage = ({ event }: { event: Event }) => {
    const router = useRouter();
    const { id } = useParams();
    console.log({ event })
    // Format date and time for Nepal (Asia/Kathmandu)
    const formatDate = (dateString: string | number | Date) => {
        if (!dateString) return 'Date not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Kathmandu',
        });
    };

    const formatTime = (dateString: string | number | Date) => {
        if (!dateString) return 'Time not specified';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Asia/Kathmandu',
        });
    };


    // Format full address
    const fullAddress = event?.location
        ? `${event.location.address}, ${event.location.city}, ${event.location.state}, ${event.location.country}`
        : 'Location not specified';

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div>
                <Image
                    src={event.images && event.images[0] || defaultImage}
                    alt={event.title || 'Event'}
                    width={1000}
                    height={1000}
                />
                <div className="bg-white dark:bg-gray-800 p-4 flex-col space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-3xl font-bold">{event.title}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {event.tags && event.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </Badge>
                                ))}
                                <Badge variant="secondary">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {event.category}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <Button onClick={() => router.replace('/booking/' + id)}>
                                Book Now
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-x-4 flex justify-between items-center px-4">
                        <div className="flex justify-start items-center gap-x-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex justify-start items-center gap-x-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <span>{formatTime(event.date)}</span>
                        </div>
                        {event.venue && event.location && (
                            <div className="flex justify-start items-center gap-x-2">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                <div>
                                    <div>{event.venue.name}</div>
                                    <div className="text-sm text-gray-500">{fullAddress}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 space-y-4">
                <h1 className="font-semibold text-3xl">Overview</h1>
                <div>
                    <p>{event.description}</p>
                    {event.venue && (
                        <p className="mt-2 text-gray-600">
                            <strong>Venue Description:</strong> {event.venue.description} (Capacity: {event.venue.capacity}, Amenities: {event.venue.amenities.join(', ')})
                        </p>
                    )}
                </div>
                {/* Agenda section (empty as no Agenda items are provided) */}
                {event.agendas && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <div className="font-bold">Event Agenda</div>
                            <div className="text-gray-500">
                                No agenda items available for this event.
                            </div>
                        </div>
                    </>
                )}
            </div>

            {event.organizerProfile && (
                <div className="space-y-4 bg-white dark:bg-gray-800 p-4">
                    <h1 className="font-bold text-3xl">Organizer Details</h1>
                    <Separator />
                    <div className="space-y-1">
                        <h3 className="font-semibold italic">{event.organizerProfile.businessName}</h3>
                        <div className="text-gray-500">
                            Contact information not available. Please check the event website for details.
                        </div>
                        {event.organizerProfile.isKycVerified && (
                            <Badge variant="default" className="mt-2">
                                KYC Verified
                            </Badge>
                        )}
                    </div>
                </div>
            )}

            {event.ticketTypes && event.ticketTypes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {event.ticketTypes.map((ticket: any, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    <div className="font-semibold">{ticket.name}</div>
                                    <div className="text-xl font-bold mt-2">
                                        USD {ticket.price}
                                    </div>
                                    <Badge
                                        variant={ticket.availability === 'AVAILABLE' ? 'secondary' : 'destructive'}
                                        className="mt-2"
                                    >
                                        {ticket.availability}
                                    </Badge>
                                    {ticket.features && typeof ticket.features === 'object' && (
                                        <div className="text-sm text-gray-600 mt-2 space-y-1">
                                            <strong className="block">Features:</strong>
                                            <ul className="list-disc list-inside">
                                                {Object.entries(ticket.features).map(([key, value]) => (
                                                    <li key={key}>
                                                        <span className="capitalize font-medium">{key}</span>: {String(value)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {event.sponsors && event.sponsors.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sponsors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            {event.sponsors.map((sponsor: any, index) => (
                                <a
                                    key={index}
                                    href={sponsor.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {sponsor.name}
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default EventDetailsPage;