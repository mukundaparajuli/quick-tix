"use client";

import { Suspense, use } from 'react';
import { notFound } from 'next/navigation';
import { useGetBookingById } from '@/hooks/booking/use-booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, User, CreditCard, Download, Ticket } from 'lucide-react';
import { formatDate } from '@/utils/format-date';
import { generateBookingTicketPDF } from '@/utils/pdf-generator';
import { toast } from 'sonner';

interface BookingDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

function BookingDetailsContent({ bookingId }: { bookingId: number }) {
    const { data: booking, isLoading, error } = useGetBookingById(bookingId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive mb-2">Booking Not Found</h2>
                    <p className="text-muted-foreground">The booking you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
                </div>
            </div>
        );
    }

    const handleDownloadTicket = async () => {
        try {
            await generateBookingTicketPDF(booking);
            toast.success('Ticket downloaded successfully!');
        } catch (error) {
            console.error('Error generating ticket:', error);
            toast.error('Failed to download ticket. Please try again.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            case 'UNPAID':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Booking Details</h1>
                    <p className="text-muted-foreground">Booking ID: #{booking.bookingId}</p>
                </div>
                <Button onClick={handleDownloadTicket} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Ticket
                </Button>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
                <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                </Badge>
                <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                    Payment: {booking.paymentStatus}
                </Badge>
            </div>

            {/* Event Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Ticket className="h-5 w-5" />
                        Event Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold">{booking.event.title}</h3>
                        {booking.event.organizer && (
                            <p className="text-muted-foreground">
                                Organized by {booking.event.organizer.organizationName || booking.event.organizer.user.name}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(booking.event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.event.location}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Seats Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Seats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {booking.seats.map((seat) => (
                            <div key={seat.id} className="border rounded-lg p-4">
                                <div className="font-semibold">{seat.label}</div>
                                <div className="text-sm text-muted-foreground">{seat.sectionName}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Payment Information */}
            {booking.payment && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                <div className="text-lg font-semibold">Rs. {booking.payment.amount}</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Method</label>
                                <div className="capitalize">{booking.payment.method}</div>
                            </div>
                            {booking.payment.transactionId && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                                    <div className="font-mono text-sm">{booking.payment.transactionId}</div>
                                </div>
                            )}
                            {booking.payment.paidAt && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Paid At</label>
                                    <div>{formatDate(booking.payment.paidAt)}</div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Attendee Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Attendee Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <div>{booking.attendee.user.name}</div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <div>{booking.attendee.user.email}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Booking Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Booking Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Created</span>
                            <span>{formatDate(booking.createdAt)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Updated</span>
                            <span>{formatDate(booking.updatedAt)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function BookingDetailsPage({ params }: BookingDetailsPageProps) {
    const resolvedParams = use(params);
    const bookingId = parseInt(resolvedParams.id);

    if (isNaN(bookingId)) {
        notFound();
    }

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading booking details...</p>
                </div>
            </div>
        }>
            <BookingDetailsContent bookingId={bookingId} />
        </Suspense>
    );
}