import db from "../config/db";
import ApiError from "../types/api-error";
import { BookingStatus, PaymentStatus } from "../../generated/prisma";

interface GetBookingsParams {
    organizerId: number;
    eventId?: number;
    status?: string;
    page: number;
    limit: number;
}

interface GetEarningsParams {
    organizerId: number;
    startDate?: Date;
    endDate?: Date;
}

class OrganizerService {
    // Get all events for an organizer
    async getOrganizerEvents(organizerId: number) {
        const events = await db.event.findMany({
            where: { organizerId },
            include: {
                media: { take: 1 },
                _count: {
                    select: {
                        bookings: true,
                    },
                },
                venue: {
                    include: {
                        sections: {
                            include: {
                                _count: {
                                    select: { seats: true }
                                }
                            }
                        }
                    }
                },
                ticketTypes: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return events.map(event => ({
            ...event,
            totalBookings: event._count.bookings,
            totalSeats: event.venue?.sections.reduce((acc, section) => acc + section._count.seats, 0) || 0,
        }));
    }

    // Get all bookings for organizer's events
    async getOrganizerBookings(params: GetBookingsParams) {
        const { organizerId, eventId, status, page, limit } = params;

        const whereClause: any = {
            event: {
                organizerId,
            },
        };

        if (eventId) {
            whereClause.eventId = eventId;
        }

        if (status) {
            whereClause.status = status as BookingStatus;
        }

        const [bookings, totalCount] = await Promise.all([
            db.booking.findMany({
                where: whereClause,
                include: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            date: true,
                            location: true,
                        },
                    },
                    attendee: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    seats: {
                        select: {
                            id: true,
                            label: true,
                            section: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    payment: {
                        select: {
                            id: true,
                            amount: true,
                            status: true,
                            method: true,
                            paidAt: true,
                            transactionId: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.booking.count({ where: whereClause }),
        ]);

        return {
            bookings,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }

    // Get dashboard stats for organizer
    async getOrganizerStats(organizerId: number) {
        const [
            totalEvents,
            publishedEvents,
            draftEvents,
            totalBookings,
            confirmedBookings,
            pendingBookings,
            cancelledBookings,
            totalEarnings,
            recentBookings,
            upcomingEvents,
        ] = await Promise.all([
            // Total events
            db.event.count({ where: { organizerId } }),

            // Published events
            db.event.count({ where: { organizerId, isPublished: true } }),

            // Draft events
            db.event.count({ where: { organizerId, isPublished: false } }),

            // Total bookings
            db.booking.count({
                where: { event: { organizerId } },
            }),

            // Confirmed bookings
            db.booking.count({
                where: { event: { organizerId }, status: BookingStatus.CONFIRMED },
            }),

            // Pending bookings
            db.booking.count({
                where: { event: { organizerId }, status: BookingStatus.PENDING },
            }),

            // Cancelled bookings
            db.booking.count({
                where: { event: { organizerId }, status: BookingStatus.CANCELLED },
            }),

            // Total earnings (from confirmed bookings)
            db.payment.aggregate({
                where: {
                    booking: { event: { organizerId } },
                    status: PaymentStatus.PAID,
                },
                _sum: { amount: true },
            }),

            // Recent bookings (last 5)
            db.booking.findMany({
                where: { event: { organizerId } },
                include: {
                    event: { select: { title: true } },
                    attendee: {
                        include: { user: { select: { name: true, email: true } } },
                    },
                    payment: { select: { amount: true, status: true } },
                },
                orderBy: { createdAt: "desc" },
                take: 5,
            }),

            // Upcoming events
            db.event.findMany({
                where: {
                    organizerId,
                    date: { gte: new Date() },
                    isPublished: true,
                },
                include: {
                    _count: { select: { bookings: true } },
                    media: { take: 1 },
                },
                orderBy: { date: "asc" },
                take: 5,
            }),
        ]);

        return {
            events: {
                total: totalEvents,
                published: publishedEvents,
                drafts: draftEvents,
            },
            bookings: {
                total: totalBookings,
                confirmed: confirmedBookings,
                pending: pendingBookings,
                cancelled: cancelledBookings,
            },
            earnings: {
                total: totalEarnings._sum.amount || 0,
            },
            recentBookings,
            upcomingEvents: upcomingEvents.map(event => ({
                ...event,
                bookingCount: event._count.bookings,
            })),
        };
    }

    // Get earnings/wallet info
    async getOrganizerEarnings(params: GetEarningsParams) {
        const { organizerId, startDate, endDate } = params;

        const whereClause: any = {
            booking: { event: { organizerId } },
            status: PaymentStatus.PAID,
        };

        if (startDate || endDate) {
            whereClause.paidAt = {};
            if (startDate) whereClause.paidAt.gte = startDate;
            if (endDate) whereClause.paidAt.lte = endDate;
        }

        const [totalEarnings, payments, earningsByEvent, earningsByMonth] = await Promise.all([
            // Total earnings
            db.payment.aggregate({
                where: whereClause,
                _sum: { amount: true },
                _count: true,
            }),

            // Recent payments
            db.payment.findMany({
                where: whereClause,
                include: {
                    booking: {
                        include: {
                            event: { select: { id: true, title: true } },
                            attendee: {
                                include: { user: { select: { name: true, email: true } } },
                            },
                        },
                    },
                },
                orderBy: { paidAt: "desc" },
                take: 20,
            }),

            // Earnings by event
            db.event.findMany({
                where: { organizerId },
                include: {
                    bookings: {
                        where: { paymentStatus: PaymentStatus.PAID },
                        include: { payment: { select: { amount: true } } },
                    },
                },
            }),

            // Earnings by month (last 6 months)
            this.getEarningsByMonth(organizerId, 6),
        ]);

        const eventEarnings = earningsByEvent.map(event => ({
            eventId: event.id,
            eventTitle: event.title,
            totalEarnings: event.bookings.reduce((sum, booking) => sum + (booking.payment?.amount || 0), 0),
            totalBookings: event.bookings.length,
        }));

        return {
            totalEarnings: totalEarnings._sum.amount || 0,
            totalTransactions: totalEarnings._count || 0,
            recentPayments: payments,
            earningsByEvent: eventEarnings,
            earningsByMonth,
        };
    }

    // Helper: Get earnings grouped by month
    private async getEarningsByMonth(organizerId: number, months: number) {
        const result: { month: string; earnings: number; bookings: number }[] = [];

        for (let i = 0; i < months; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

            const [earnings, bookingsCount] = await Promise.all([
                db.payment.aggregate({
                    where: {
                        booking: { event: { organizerId } },
                        status: PaymentStatus.PAID,
                        paidAt: { gte: startOfMonth, lte: endOfMonth },
                    },
                    _sum: { amount: true },
                }),
                db.booking.count({
                    where: {
                        event: { organizerId },
                        status: BookingStatus.CONFIRMED,
                        createdAt: { gte: startOfMonth, lte: endOfMonth },
                    },
                }),
            ]);

            result.push({
                month: startOfMonth.toLocaleString("default", { month: "short", year: "numeric" }),
                earnings: earnings._sum.amount || 0,
                bookings: bookingsCount,
            });
        }

        return result.reverse();
    }

    // Update event
    async updateEvent(eventId: number, organizerId: number, updateData: any) {
        // Verify event belongs to organizer
        const event = await db.event.findFirst({
            where: { id: eventId, organizerId },
        });

        if (!event) {
            throw new ApiError(404, "Event not found or you don't have permission to update it");
        }

        const { images, ...eventData } = updateData;

        const updatedEvent = await db.event.update({
            where: { id: eventId },
            data: {
                ...(eventData.title && { title: eventData.title }),
                ...(eventData.description !== undefined && { description: eventData.description }),
                ...(eventData.date && { date: new Date(eventData.date) }),
                ...(eventData.location && { location: eventData.location }),
                ...(eventData.capacity !== undefined && { capacity: eventData.capacity }),
            },
            include: { media: true },
        });

        return updatedEvent;
    }

    // Get booking details for organizer
    async getBookingDetails(bookingId: number, organizerId: number) {
        const booking = await db.booking.findFirst({
            where: {
                id: bookingId,
                event: { organizerId },
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        date: true,
                        location: true,
                    },
                },
                attendee: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                seats: {
                    include: {
                        section: { select: { name: true } },
                        ticketType: { select: { name: true, price: true } },
                    },
                },
                payment: true,
                tickets: {
                    include: {
                        ticketType: { select: { name: true, price: true } },
                    },
                },
            },
        });

        if (!booking) {
            throw new ApiError(404, "Booking not found or you don't have permission to view it");
        }

        return booking;
    }
}

export const organizerService = new OrganizerService();
