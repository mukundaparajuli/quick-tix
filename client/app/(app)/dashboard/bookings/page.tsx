"use client";

import React from 'react';
import { useGetUserBookings } from '@/hooks/booking/use-booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, CreditCard, Users, Download } from 'lucide-react';
import { generateBookingTicketPDF } from '@/utils/pdf-generator';

export default function BookingsPage() {
    const { data: bookings, isFetching, error } = useGetUserBookings();
    console.log("User Bookings:", bookings);
    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <div className="text-slate-500">Loading your bookings...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500">Error loading bookings</div>
                    <p className="text-gray-500 mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="mt-2 text-gray-600">View and manage your event bookings</p>
                </div>

                {!bookings || bookings.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                            <p className="text-gray-500 text-center">
                                You haven&apos;t made any bookings yet. Start exploring events to make your first booking!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <Card key={booking.bookingId} className="overflow-hidden">
                                <CardHeader className="bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl text-gray-900">
                                                {booking.event.title}
                                            </CardTitle>
                                            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-1 sm:space-x-6">
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <CalendarDays className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                                    {booking.event.date ? new Date(booking.event.date).toLocaleString() : 'Date TBD'}
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                                    {booking.event.location || 'Venue TBD'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2">
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => generateBookingTicketPDF(booking)}
                                                    className="flex items-center space-x-1"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span>Download Ticket</span>
                                                </Button>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Badge
                                                    variant={booking.status === 'CONFIRMED' ? 'default' : booking.status === 'PENDING' ? 'secondary' : 'destructive'}
                                                    className="text-xs"
                                                >
                                                    {booking.status}
                                                </Badge>
                                                <Badge
                                                    variant={booking.paymentStatus === 'PAID' ? 'default' : booking.paymentStatus === 'PENDING' ? 'secondary' : 'destructive'}
                                                    className="text-xs"
                                                >
                                                    {booking.paymentStatus}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Seats</h4>
                                            <div className="space-y-1">
                                                {booking.seats.map((seat) => (
                                                    <div key={seat.id} className="text-sm text-gray-600">
                                                        {seat.label} - {seat.sectionName}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Payment</h4>
                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-600">
                                                    <CreditCard className="inline h-4 w-4 mr-1" />
                                                    {booking.payment?.method?.toUpperCase() || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Transaction: {booking.payment?.transactionId || 'N/A'}
                                                </div>
                                                {booking.payment?.paidAt && (
                                                    <div className="text-sm text-gray-600">
                                                        Paid: {new Date(booking.payment.paidAt).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Total</h4>
                                            <div className="text-2xl font-bold text-green-600">
                                                Rs. {booking.totalPrice.toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}