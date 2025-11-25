import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import ApiError from "../types/api-error";
import ApiResponse from "../types/api-response";
import { PaymentMethod, BookingStatus, PaymentStatus } from "@prisma/client";
import paymentService from "../services/payments/payment.service";
import { InitiatePaymentData } from "../types/payment";
import db from "../config/db";


export const InitiateBooking = asyncHandler(async (req: Request, res: Response) => {
    const { eventId, ticketTypes, seatIds, attendeeId, paymentMethod } = req.body;

    if (!eventId || !ticketTypes || !attendeeId || !paymentMethod) {
        throw new ApiError(400, "Event ID, ticket types, attendee ID, and payment method are required");
    }

    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
        throw new ApiError(400, "Invalid payment method");
    }

    if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
        throw new ApiError(400, "At least one ticket type is required");
    }

    const transaction = await db.$transaction(async (prisma) => {
        // 1. Validate event and availability
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                ticketTypes: {
                    include: {
                        seats: true,
                        facilities: true
                    }
                },
                organizer: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            }
        });

        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        if (event.date < new Date()) {
            throw new ApiError(400, "Event has already occurred");
        }

        if (!event.isPublished) {
            throw new ApiError(400, "Event is not published");
        }

        // 2. Calculate total and validate tickets
        let totalPrice = 0;
        const ticketDetails: Array<{ typeId: number; quantity: number; totalPrice: number }> = [];

        for (const requestedTicket of ticketTypes) {
            const ticketType = event.ticketTypes.find(tt => tt.id === requestedTicket.ticketTypeId);

            if (!ticketType) {
                throw new ApiError(404, `Ticket type ${requestedTicket.ticketTypeId} not found`);
            }

            if (ticketType.capacity && (ticketType.sold + requestedTicket.quantity) > ticketType.capacity) {
                throw new ApiError(400, `Not enough capacity for ${ticketType.name}`);
            }

            const ticketTotal = ticketType.price * requestedTicket.quantity;
            totalPrice += ticketTotal;

            ticketDetails.push({
                typeId: ticketType.id,
                quantity: requestedTicket.quantity,
                totalPrice: ticketTotal
            });
        }

        // 3. Validate seats if provided
        if (seatIds && seatIds.length > 0) {
            const seats = await prisma.seat.findMany({
                where: {
                    id: { in: seatIds },
                    isBooked: false
                }
            });

            if (seats.length !== seatIds.length) {
                throw new ApiError(400, "Some seats are already booked or not available");
            }
        }

        // 4. Validate attendee
        const attendee = await prisma.attendeeProfile.findUnique({
            where: { userId: attendeeId },
            include: {
                user: true
            }
        });

        if (!attendee) {
            throw new ApiError(404, "Attendee profile not found");
        }

        // 5. Create booking record
        const booking = await prisma.booking.create({
            data: {
                eventId,
                attendeeId: attendee.id,
                totalPrice,
                status: BookingStatus.PENDING,
                paymentStatus: PaymentStatus.UNPAID
            }
        });

        // 6. Create ticket records
        const createdTickets = [];
        for (const ticketDetail of ticketDetails) {
            const ticket = await prisma.ticket.create({
                data: {
                    ...ticketDetail,
                    bookingId: booking.id
                }
            });
            createdTickets.push(ticket);
        }

        // 7. Reserve seats if provided
        if (seatIds && seatIds.length > 0) {
            await prisma.seat.updateMany({
                where: { id: { in: seatIds } },
                data: {
                    isBooked: true,
                    bookingId: booking.id
                }
            });
        }

        // 8. Initialize payment based on selected method
        const paymentData: InitiatePaymentData = {
            bookingId: booking.id,
            amount: totalPrice,
            eventName: event.title,
            customerName: attendee.user.name || "Customer",
            customerEmail: attendee.user.email
        };

        const paymentResponse = await paymentService.initiatePayment(paymentMethod, paymentData);

        // 9. Create payment record
        const payment = await prisma.payment.create({
            data: {
                amount: totalPrice,
                bookingId: booking.id,
                method: paymentMethod,
                status: PaymentStatus.PENDING,
                transactionId: paymentResponse.transactionId || paymentResponse.pidx,
                provider: paymentMethod
            }
        });

        return {
            booking,
            tickets: createdTickets,
            payment,
            paymentResponse,
            paymentMethod
        };
    });

    // Format response based on payment method
    const responseData: any = {
        bookingId: transaction.booking.id,
        totalAmount: transaction.booking.totalPrice,
        tickets: transaction.tickets,
        paymentMethod: transaction.paymentMethod
    };

    // Different response structure for different gateways
    if (transaction.paymentMethod === PaymentMethod.KHALTI) {
        responseData.paymentUrl = transaction.paymentResponse.payment_url;
        responseData.redirectType = "GET";
        responseData.pidx = transaction.paymentResponse.pidx;
    } else if (transaction.paymentMethod === PaymentMethod.ESEWA) {
        responseData.paymentUrl = transaction.paymentResponse.payment_url;
        responseData.payload = transaction.paymentResponse.payload;
        responseData.redirectType = "POST";
    }

    return new ApiResponse(res, 201, "Booking initiated successfully", responseData);
});

export const VerifyKhaltiPayment = asyncHandler(async (req: Request, res: Response) => {
    const { pidx } = req.query;

    if (!pidx || typeof pidx !== "string") {
        throw new ApiError(400, "Valid pidx is required");
    }

    const verification = await paymentService.verifyPayment(PaymentMethod.KHALTI, pidx);
    await handlePaymentVerification(verification, pidx, res);
});

export const VerifyEsewaPayment = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId, status } = req.query;
    const formData = req.body;

    if (!bookingId) {
        throw new ApiError(400, "Booking ID is required");
    }

    if (status === "failure") {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?bookingId=${bookingId}`);
    }

    const verification = await paymentService.verifyPayment(PaymentMethod.ESEWA, {
        data: formData,
        bookingId: parseInt(bookingId as string)
    });

    await handlePaymentVerification(verification, formData.transaction_uuid, res);
});

export const GetBooking = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Booking ID is required");
    }

    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
        throw new ApiError(400, "Valid booking ID is required");
    }

    const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: {
            event: {
                select: {
                    id: true,
                    title: true,
                    date: true,
                    location: true,
                    organizer: {
                        include: {
                            user: {
                                select: { name: true }
                            }
                        }
                    }
                }
            },
            attendee: {
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            },
            tickets: {
                include: {
                    ticketType: {
                        select: {
                            name: true,
                            price: true,
                            description: true
                        }
                    }
                }
            },
            seats: {
                include: {
                    section: {
                        select: { name: true }
                    }
                }
            },
            payment: true
        }
    });

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return new ApiResponse(res, 200, "Booking retrieved successfully", booking);
});

export const CancelBooking = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { refundReason } = req.body;

    if (!id) {
        throw new ApiError(400, "Booking ID is required");
    }

    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
        throw new ApiError(400, "Valid booking ID is required");
    }

    const transaction = await db.$transaction(async (prisma) => {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                tickets: true,
                seats: true,
                payment: true
            }
        });

        if (!booking) {
            throw new ApiError(404, "Booking not found");
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new ApiError(400, "Booking is already cancelled");
        }

        if (booking.status === BookingStatus.CONFIRMED && booking.paymentStatus === PaymentStatus.PAID) {
            throw new ApiError(400, "Cannot cancel a confirmed and paid booking");
        }

        // Update booking status
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: BookingStatus.CANCELLED
            }
        });

        // Update payment if exists
        if (booking.payment) {
            await prisma.payment.update({
                where: { id: booking.payment.id },
                data: {
                    refundReason: refundReason || "Cancelled by user"
                }
            });
        }

        // Release seats
        if (booking.seats.length > 0) {
            await prisma.seat.updateMany({
                where: { bookingId: bookingId },
                data: {
                    isBooked: false,
                    bookingId: null
                }
            });
        }

        // Update ticket counts
        for (const ticket of booking.tickets) {
            await prisma.ticketType.update({
                where: { id: ticket.typeId },
                data: {
                    sold: { decrement: ticket.quantity }
                }
            });
        }

        return updatedBooking;
    });

    return new ApiResponse(res, 200, "Booking cancelled successfully", transaction);
});

export const GetPaymentMethods = asyncHandler(async (req: Request, res: Response) => {
    const methods = [
        {
            code: PaymentMethod.KHALTI,
            name: "Khalti",
            description: "Pay with Khalti Wallet",
            icon: "/icons/khalti.png",
            supported: true
        },
        {
            code: PaymentMethod.ESEWA,
            name: "eSewa",
            description: "Pay with eSewa Wallet",
            icon: "/icons/esewa.png",
            supported: true
        },
        {
            code: PaymentMethod.CARD,
            name: "Credit/Debit Card",
            description: "Pay with your card",
            icon: "/icons/card.png",
            supported: false
        },
        {
            code: PaymentMethod.CASH,
            name: "Cash Payment",
            description: "Pay with cash on arrival",
            icon: "/icons/cash.png",
            supported: true
        }
    ];

    return new ApiResponse(res, 200, "Payment methods retrieved successfully", methods);
});

// Helper function for payment verification
const handlePaymentVerification = async (verification: any, transactionId: string, res: Response): Promise<void> => {
    try {
        const transaction = await db.$transaction(async (prisma) => {
            // Find payment record
            const payment = await prisma.payment.findFirst({
                where: { transactionId },
                include: {
                    booking: {
                        include: {
                            tickets: {
                                include: {
                                    ticketType: true
                                }
                            },
                            seats: true
                        }
                    }
                }
            });

            if (!payment) {
                throw new ApiError(404, "Payment record not found");
            }

            if (verification.status === "Completed") {
                // Update payment status
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: PaymentStatus.PAID,
                        paidAt: new Date(),
                        provider: payment.method
                    }
                });

                // Update booking status
                await prisma.booking.update({
                    where: { id: payment.booking.id },
                    data: {
                        status: BookingStatus.CONFIRMED,
                        paymentStatus: PaymentStatus.PAID
                    }
                });

                // Update ticket sold counts
                for (const ticket of payment.booking.tickets) {
                    await prisma.ticketType.update({
                        where: { id: ticket.typeId },
                        data: {
                            sold: { increment: ticket.quantity }
                        }
                    });
                }

                return { success: true, booking: payment.booking };
            } else {
                // Payment failed
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: PaymentStatus.FAILED }
                });

                await prisma.booking.update({
                    where: { id: payment.booking.id },
                    data: {
                        status: BookingStatus.CANCELLED,
                        paymentStatus: PaymentStatus.FAILED
                    }
                });

                // Release reserved seats
                await prisma.seat.updateMany({
                    where: { bookingId: payment.booking.id },
                    data: {
                        isBooked: false,
                        bookingId: null
                    }
                });

                return { success: false, booking: payment.booking };
            }
        });

        if (transaction.success) {
            res.redirect(`${process.env.FRONTEND_URL}/booking-confirmed?bookingId=${transaction.booking.id}`);
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed?bookingId=${transaction.booking.id}`);
        }

    } catch (error: any) {
        console.error("Payment verification error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/payment-error?error=${encodeURIComponent(error.message)}`);
    }
};