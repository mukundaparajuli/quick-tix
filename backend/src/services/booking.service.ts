import { PrismaClient, Booking, Payment, Seat, BookingStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import ApiError from '../types/api-error';

const prisma = new PrismaClient();

export interface CreateBookingData {
    eventId: number;
    attendeeId: number;
    seatIds: string[];
    totalPrice: number;
    paymentMethod: PaymentMethod;
}

export interface UpdatePaymentData {
    bookingId: number;
    paymentUrl?: string;
    transactionId?: string;
    pidx?: string;
    expiresAt?: Date;
    gatewayResponse?: any;
}

class BookingService {
    async createBooking(data: CreateBookingData): Promise<Booking> {
        try {
            return await prisma.$transaction(async (tx) => {
                // Check if booking already exists for this event and attendee
                // const existingBooking = await tx.booking.findFirst({
                //     where: {
                //         eventId: data.eventId,
                //         attendeeId: data.attendeeId,
                //         status: {
                //             in: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
                //         }
                //     }
                // });

                // if (existingBooking) {
                //     if (existingBooking.status === BookingStatus.CONFIRMED) {
                //         throw new ApiError(400, 'You already have a confirmed booking for this event');
                //     } else {
                //         throw new ApiError(400, 'You already have a pending booking for this event. Please complete the payment or wait for it to expire.');
                //     }
                // }

                // Check if seats are available
                const seats = await tx.seat.findMany({
                    where: {
                        id: {
                            in: data.seatIds.map(id => parseInt(id))
                        },
                        isBooked: false
                    }
                });

                if (seats.length !== data.seatIds.length) {
                    throw new ApiError(400, 'Some seats are no longer available');
                }

                // Create booking
                const booking = await tx.booking.create({
                    data: {
                        eventId: data.eventId,
                        attendeeId: data.attendeeId,
                        totalPrice: data.totalPrice,
                        status: BookingStatus.PENDING,
                        paymentStatus: PaymentStatus.UNPAID
                    }
                });

                // Reserve seats (mark as booked but don't assign booking yet)
                await tx.seat.updateMany({
                    where: {
                        id: {
                            in: data.seatIds.map(id => parseInt(id))
                        }
                    },
                    data: {
                        isBooked: true,
                        bookingId: booking.id
                    }
                });

                // Create payment record
                await tx.payment.create({
                    data: {
                        bookingId: booking.id,
                        amount: data.totalPrice,
                        method: data.paymentMethod,
                        status: PaymentStatus.PENDING,
                        currency: 'NPR'
                    }
                });

                return booking;
            });
        } catch (error: any) {
            console.error('Error creating booking:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to create booking');
        }
    }

    async updatePaymentDetails(data: UpdatePaymentData): Promise<Payment> {
        try {
            const updateData: any = {
                updatedAt: new Date()
            };

            if (data.paymentUrl !== undefined) updateData.paymentUrl = data.paymentUrl;
            if (data.transactionId !== undefined) updateData.transactionId = data.transactionId;
            if (data.pidx !== undefined) updateData.pidx = data.pidx;
            if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;
            if (data.gatewayResponse !== undefined) updateData.gatewayResponse = data.gatewayResponse;

            const payment = await prisma.payment.update({
                where: { bookingId: data.bookingId },
                data: updateData
            });

            return payment;
        } catch (error: any) {
            console.error('Error updating payment details:', error);
            throw new ApiError(500, 'Failed to update payment details');
        }
    }

    async confirmPayment(bookingId: number, verificationResponse: any): Promise<Booking> {
        try {
            return await prisma.$transaction(async (tx) => {
                // Update payment status
                await tx.payment.update({
                    where: { bookingId },
                    data: {
                        status: PaymentStatus.PAID,
                        paidAt: new Date(),
                        gatewayResponse: verificationResponse as any,
                        transactionId: verificationResponse.transaction_id || verificationResponse.transaction_uuid
                    }
                });

                // Update booking status
                const booking = await tx.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: BookingStatus.CONFIRMED,
                        paymentStatus: PaymentStatus.PAID
                    },
                    include: {
                        seats: true,
                        event: true,
                        payment: true
                    }
                });

                return booking;
            });
        } catch (error: any) {
            console.error('Error confirming payment:', error);
            throw new ApiError(500, 'Failed to confirm payment');
        }
    }

    async failPayment(bookingId: number, reason?: string): Promise<void> {
        try {
            await prisma.$transaction(async (tx) => {
                // Update payment status
                await tx.payment.update({
                    where: { bookingId },
                    data: {
                        status: PaymentStatus.FAILED,
                        refundReason: reason
                    }
                });

                // Update booking status and release seats
                await tx.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: BookingStatus.CANCELLED,
                        paymentStatus: PaymentStatus.FAILED
                    }
                });

                // Release seats
                await tx.seat.updateMany({
                    where: { bookingId },
                    data: {
                        isBooked: false,
                        bookingId: null
                    }
                });
            });
        } catch (error: any) {
            console.error('Error failing payment:', error);
            throw new ApiError(500, 'Failed to update payment status');
        }
    }

    async getBookingWithPayment(bookingId: number): Promise<any> {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    payment: true,
                    seats: true,
                    event: true,
                    attendee: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });

            if (!booking) {
                throw new ApiError(404, 'Booking not found');
            }

            return booking as any;
        } catch (error: any) {
            console.error('Error getting booking:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to get booking details');
        }
    }

    async getBookingByPidx(pidx: string): Promise<any> {
        try {
            const payment = await prisma.payment.findFirst({
                where: { pidx: pidx },
                include: {
                    booking: {
                        include: {
                            seats: true,
                            event: true,
                            attendee: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            email: true,
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (!payment || !payment.booking) {
                throw new ApiError(404, 'Booking not found for this payment');
            }

            return { ...payment.booking, payment } as any;
        } catch (error: any) {
            console.error('Error getting booking by pidx:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to get booking details');
        }
    }

    async getUserBookings(attendeeId: number) {
        try {
            const bookings = await prisma.booking.findMany({
                where: {
                    attendeeId: attendeeId
                },
                include: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            date: true,
                            location: true
                        }
                    },
                    seats: {
                        select: {
                            id: true,
                            label: true,
                            sectionId: true,
                            section: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    payment: {
                        select: {
                            id: true,
                            amount: true,
                            method: true,
                            status: true,
                            transactionId: true,
                            paidAt: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return bookings.map(booking => ({
                bookingId: booking.id,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                totalPrice: booking.totalPrice,
                event: booking.event,
                seats: booking.seats.map(seat => ({
                    id: seat.id,
                    label: seat.label,
                    sectionId: seat.sectionId,
                    sectionName: seat.section.name
                })),
                payment: booking.payment,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }));
        } catch (error: any) {
            console.error('Error fetching user bookings:', error);
            throw new ApiError(500, 'Failed to fetch user bookings');
        }
    }

    async cleanupExpiredBookings(): Promise<void> {
        try {
            const expiredTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago

            await prisma.$transaction(async (tx) => {
                // Find expired bookings
                const expiredBookings = await tx.booking.findMany({
                    where: {
                        status: BookingStatus.PENDING,
                        paymentStatus: PaymentStatus.UNPAID,
                        createdAt: {
                            lt: expiredTime
                        }
                    }
                });

                if (expiredBookings.length > 0) {
                    const expiredBookingIds = expiredBookings.map(b => b.id);

                    // Release seats
                    await tx.seat.updateMany({
                        where: {
                            bookingId: {
                                in: expiredBookingIds
                            }
                        },
                        data: {
                            isBooked: false,
                            bookingId: null
                        }
                    });

                    // Update booking status
                    await tx.booking.updateMany({
                        where: {
                            id: {
                                in: expiredBookingIds
                            }
                        },
                        data: {
                            status: BookingStatus.CANCELLED,
                            paymentStatus: PaymentStatus.FAILED
                        }
                    });

                    // Update payment status
                    await tx.payment.updateMany({
                        where: {
                            bookingId: {
                                in: expiredBookingIds
                            }
                        },
                        data: {
                            status: PaymentStatus.FAILED,
                            refundReason: 'Booking expired'
                        }
                    });

                    console.log(`Cleaned up ${expiredBookings.length} expired bookings`);
                }
            });
        } catch (error: any) {
            console.error('Error cleaning up expired bookings:', error);
        }
    }
}

export const bookingService = new BookingService();