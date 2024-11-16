import React from 'react';
import { Calendar, Clock, MapPin, Mail, Phone, Globe, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { bannerImageSrc } from '@/constants/banner-search-menu';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

const event = {
    "id": "evt_001",
    "name": "Tech Innovation Conference 2024",
    "description": "A conference bringing together tech enthusiasts, developers, and entrepreneurs to explore the latest innovations in technology.",
    "date": "2024-12-15",
    "time": "09:00 AM - 05:00 PM",
    "location": {
        "venue": "Pokhara Exhibition Center",
        "address": "New Road, Pokhara, Nepal",
        "latitude": 28.2096,
        "longitude": 83.9856
    },
    "organizer": {
        "name": "Tech Enthusiasts Nepal",
        "contact_email": "info@techenthusiastsnepal.org",
        "contact_phone": "+977-9800000000",
        "website": "https://techenthusiastsnepal.org"
    },
    "agenda": [
        { "time": "09:00 AM", "activity": "Registration & Networking" },
        { "time": "10:00 AM", "activity": "Opening Keynote: The Future of AI" },
        { "time": "11:00 AM", "activity": "Panel Discussion: Blockchain for Transparency" },
        { "time": "01:00 PM", "activity": "Lunch Break" },
        { "time": "02:00 PM", "activity": "Workshop: Building Scalable Web Apps" },
        { "time": "04:00 PM", "activity": "Closing Remarks & Feedback Session" }
    ],
    "tickets": [
        { "type": "General Admission", "price": 20, "currency": "USD", "availability": "Available" },
        { "type": "VIP Pass", "price": 50, "currency": "USD", "availability": "Sold Out" }
    ],
    "sponsors": [
        { "name": "Nepal Tech Solutions", "website": "https://nepaltechsolutions.com" },
        { "name": "CloudWare", "website": "https://cloudware.com" }
    ],
    "tags": ["Technology", "Innovation", "Networking", "Blockchain", "AI"]
};


const EventDetailsPage = () => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const router = useRouter();
    const { id } = useParams();

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div>
                <Image src={bannerImageSrc} alt='Banner Image' width={1000} height={1000} />
                <div className='bg-white dark:bg-black p-4 flex-col space-y-4'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <div className="text-3xl font-bold">{event.name}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {event.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Button onClick={() => router.replace('/booking/' + id)}>Book Now</Button>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-x-4 flex justify-between items-center px-4">
                        <div className='flex justify-start items-center gap-x-2'>
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <span>{formatDate(event.date)}</span>
                        </div>
                        <div className='flex justify-start items-center gap-x-2'>
                            <Clock className="w-5 h-5 text-blue-500" />
                            <span>{event.time}</span>
                        </div>
                        <div className='flex justify-start items-center gap-x-2'>
                            <MapPin className="w-5 h-5 text-blue-500" />
                            <div>
                                <div>{event.location.venue}</div>
                                <div className="text-sm text-gray-500">{event.location.address}</div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className='bg-white dark:bg-black p-4 space-y-4'>
                <h1 className='font-semibold text-3xl'>Overview</h1>
                <div>
                    <p>{event.description}</p>
                </div>
                <Separator />
                <div className='space-y-3'>
                    <div className='font-bold'>Event Agenda</div>
                    <div className="space-y-2">
                        {event.agenda.map((item, index) => (
                            <div key={index} className="flex">
                                <div className="w-24 font-medium">{item.time}</div>
                                <div>{item.activity}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* organizer information */}
            <div className='space-y-4 bg-white dark:bg-black p-4'>
                <h1 className='font-bold text-3xl'>Organizer Details</h1>
                <Separator />
                <div className="space-y-1">
                    <h3 className="font-semibold italic">{event.organizer.name}</h3>
                    <div className='flex justify-start items-center gap-x-2'>
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${event.organizer.contact_email}`} className="text-blue-500 hover:underline">
                            {event.organizer.contact_email}
                        </a>
                    </div>
                    <div className='flex justify-start items-center gap-x-2'>
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${event.organizer.contact_phone}`} className="text-blue-500 hover:underline">
                            {event.organizer.contact_phone}
                        </a>
                    </div>
                    <div className='flex justify-start items-center gap-x-2'>
                        <Globe className="w-4 h-4" />
                        <a href={event.organizer.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {event.organizer.website}
                        </a>
                    </div>
                </div>
            </div>

            {/* Tickets */}
            <Card>
                <CardHeader>
                    <CardTitle>Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {event.tickets.map((ticket, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-lg"
                            >
                                <div className="font-semibold">{ticket.type}</div>
                                <div className="text-xl font-bold mt-2">
                                    {ticket.currency} {ticket.price}
                                </div>
                                <Badge
                                    variant={ticket.availability === "Available" ? "secondary" : "destructive"}
                                    className="mt-2"
                                >
                                    {ticket.availability}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Sponsors */}
            <Card>
                <CardHeader>
                    <CardTitle>Sponsors</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        {event.sponsors.map((sponsor, index) => (
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
        </div>
    );
};

export default EventDetailsPage;