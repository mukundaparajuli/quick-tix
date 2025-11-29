"use client";

import { useState } from "react";
import { useOrganizerBookings } from "@/hooks/organizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/utils/format-date";
import { Search, CheckCircle, Clock, XCircle, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { OrganizerBooking } from "@/services/organizer.service";

export default function OrganizerBookingsPage() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<string>("");
    const [selectedBooking, setSelectedBooking] = useState<OrganizerBooking | null>(null);
    const limit = 10;

    const { data, isLoading, isError } = useOrganizerBookings({
        page,
        limit,
        status: status || undefined,
    });

    const handleStatusChange = (value: string) => {
        setStatus(value === "all" ? "" : value);
        setPage(1);
    };

    if (isLoading) {
        return <BookingsPageSkeleton />;
    }

    if (isError || !data) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-red-500">Failed to load bookings</p>
            </div>
        );
    }

    const { bookings, pagination } = data;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Bookings</h1>
                <p className="text-slate-500 mt-1">Manage all bookings for your events</p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search bookings..."
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={status || "all"} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">All Bookings</CardTitle>
                    <CardDescription>
                        Showing {bookings.length} of {pagination.totalCount} bookings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {bookings.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Booking ID</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Event</TableHead>
                                            <TableHead>Seats</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Payment</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell className="font-medium">#{booking.id}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {booking.attendee.user.name || "N/A"}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {booking.attendee.user.email}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm truncate max-w-[150px]">
                                                        {booking.event.title}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {booking.seats.slice(0, 2).map((seat) => (
                                                            <Badge key={seat.id} variant="outline" className="text-xs">
                                                                {seat.label}
                                                            </Badge>
                                                        ))}
                                                        {booking.seats.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{booking.seats.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    NPR {booking.totalPrice.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <BookingStatusBadge status={booking.status} />
                                                </TableCell>
                                                <TableCell>
                                                    <PaymentStatusBadge status={booking.paymentStatus} />
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-500">
                                                    {formatDate(booking.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedBooking(booking)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-slate-500">
                                    Page {pagination.page} of {pagination.totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= pagination.totalPages}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-slate-500">No bookings found</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Booking Details Dialog */}
            <BookingDetailsDialog
                booking={selectedBooking}
                open={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />
        </div>
    );
}

function BookingStatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
        CONFIRMED: { color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3" /> },
        PENDING: { color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-3 w-3" /> },
        CANCELLED: { color: "bg-red-100 text-red-700", icon: <XCircle className="h-3 w-3" /> },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
        <Badge variant="outline" className={`text-xs ${config.color} border-0`}>
            <span className="flex items-center gap-1">
                {config.icon}
                {status}
            </span>
        </Badge>
    );
}

function PaymentStatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, string> = {
        PAID: "bg-green-100 text-green-700",
        PENDING: "bg-yellow-100 text-yellow-700",
        UNPAID: "bg-slate-100 text-slate-700",
        FAILED: "bg-red-100 text-red-700",
    };

    return (
        <Badge variant="outline" className={`text-xs ${statusConfig[status] || statusConfig.PENDING} border-0`}>
            {status}
        </Badge>
    );
}

function BookingDetailsDialog({
    booking,
    open,
    onClose,
}: {
    booking: OrganizerBooking | null;
    open: boolean;
    onClose: () => void;
}) {
    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Booking #{booking.id}</DialogTitle>
                    <DialogDescription>
                        Booking details and payment information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-500 mb-2">Customer</h4>
                            <p className="font-medium">{booking.attendee.user.name || "N/A"}</p>
                            <p className="text-sm text-slate-500">{booking.attendee.user.email}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-500 mb-2">Event</h4>
                            <p className="font-medium">{booking.event.title}</p>
                            <p className="text-sm text-slate-500">{formatDate(booking.event.date)}</p>
                            <p className="text-sm text-slate-500">{booking.event.location}</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-500 mb-2">Booking Status</h4>
                            <BookingStatusBadge status={booking.status} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-500 mb-2">Payment Status</h4>
                            <PaymentStatusBadge status={booking.paymentStatus} />
                        </div>
                    </div>

                    {/* Seats */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 mb-2">Seats ({booking.seats.length})</h4>
                        <div className="flex flex-wrap gap-2">
                            {booking.seats.map((seat) => (
                                <Badge key={seat.id} variant="secondary">
                                    {seat.section.name} - {seat.label}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Payment Info */}
                    {booking.payment && (
                        <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold text-slate-500 mb-2">Payment Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500">Amount:</span>
                                    <span className="ml-2 font-semibold">NPR {booking.payment.amount.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Method:</span>
                                    <span className="ml-2">{booking.payment.method}</span>
                                </div>
                                {booking.payment.transactionId && (
                                    <div className="col-span-2">
                                        <span className="text-slate-500">Transaction ID:</span>
                                        <span className="ml-2 font-mono text-xs">{booking.payment.transactionId}</span>
                                    </div>
                                )}
                                {booking.payment.paidAt && (
                                    <div>
                                        <span className="text-slate-500">Paid At:</span>
                                        <span className="ml-2">{formatDate(booking.payment.paidAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="border-t pt-4 text-sm text-slate-500">
                        <p>Created: {formatDate(booking.createdAt)}</p>
                        <p>Updated: {formatDate(booking.updatedAt)}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function BookingsPageSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
