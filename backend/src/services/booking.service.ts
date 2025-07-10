import { Request } from "express";
import db from "../config/db";
import { BookingStatus, DiscountType, SeatStatus } from "@prisma/client";
import ApiError from "../types/api-error";
import { initializeSocket } from "../sockets";
import { io } from "..";

//lock seat for 10 minutes
const LOCK_DURATION_SECONDS = 600;

export class BookingService {
    async reserveSeat(req: Request) {
        const { eventId, ticketTypeId, seatIds, promocode } = req.body;
        const user = req.user;

        if (!user) {
            throw new ApiError(401, "Unauthorized, you are not authorized to make a booking");
        }

        const result = await db.$transaction(async (tx) => {

            // lock the available seats
            const seats = await tx.seat.findMany({
                where: {
                    id: { in: seatIds },
                    status: SeatStatus.AVAILABLE,
                    deletedAt: null
                }
            })

            if (seats.length !== seatIds.length) {
                throw new ApiError(400, "Some seats are not available or have already been reserved");
            }

            //validate event and ticket type
            const event = await tx.event.findUnique({ where: { id: eventId } });
            if (!event) {
                throw new ApiError(404, `Event with event id ${eventId} does not exist`);
            }

            const ticketType = await tx.ticketType.findUnique({ where: { id: ticketTypeId } });
            if (!ticketType) {
                throw new ApiError(404, `Ticket type with id: ${ticketTypeId} does not exist`);
            }

            // calculate the price here
            let totalPrice = seatIds.length * ticketType.price;

            //if promocode is available check the validity of that promocode
            if (promocode) {
                const promoCode = await tx.promocode.findUnique({
                    where: {
                        code: promocode,
                        eventId: eventId,
                        deletedAt: null
                    }
                })

                if (!promoCode) {
                    throw new ApiError(404, `No promocode was found for this code:${promocode}. The promocode might have been deleted or does not exist at all`);
                }

                // the promocode exists, check its validity now
                if ((promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) || promoCode.validUntil < new Date(Date.now())) {
                    throw new ApiError(400, "The validity of promocode has been expired");
                }

                if (promoCode.validFrom > new Date(Date.now())) {
                    throw new ApiError(400, "The promocode has not yet been implemented");
                }

                // check if the discount type is based on PERCENTAGE OR FIXED
                const discountType = promoCode.discountType;
                let discountedAmount = 0;
                if (discountType === DiscountType.FIXED) {
                    discountedAmount = promoCode.discount;
                } else if (discountType === DiscountType.PERCENTAGE) {
                    discountedAmount = (promoCode.discount) / 100 * totalPrice;
                }

                // increase the usedCount value
                promoCode.usedCount++;

                totalPrice = totalPrice - discountedAmount;
            }

            // create a booking now
            const booking = await db.booking.create({
                data: {
                    eventId,
                    userId: user.id,
                    ticketTypeId,
                    ticketCount: seatIds.length,
                    totalPrice,
                    status: BookingStatus.PENDING,
                    createdAt: new Date(),
                },
            });

            // Link seats to booking
            await db.seat.updateMany({
                where: { id: { in: seatIds } },
                data: { bookingId: booking.id },
            });

            return { bookingId: booking.id, seatIds, expiresAt: new Date(Date.now() + LOCK_DURATION_SECONDS * 1000) };
        });

        // broadcast seat status 
        await initializeSocket(io).broadcastSeatStatus(eventId, seatIds, "RESERVED");
        return result;
    }

    async confirmBooking(bookingId: number) {
        const result = await db.$transaction(async (tx) => {
            // find booking
            const booking = await tx.booking.findUnique({
                where: {
                    id: bookingId,
                    status: BookingStatus.PENDING,
                    deletedAt: null
                },
                include: {
                    seats: true
                }
            })

            if (!booking) {
                throw new ApiError(404, `No pending booking was not found for this booking id:${bookingId}`);
            }

            //if booking is found and is in pendint state change it to CONFIRMED
            const updatedBooking = await tx.booking.update({
                where: { id: booking.id },
                data: { status: BookingStatus.CONFIRMED }
            });

            // now mark the respective seats in the booking as BOOKED
            await tx.seat.updateMany({
                where: { bookingId: bookingId },
                data: { status: SeatStatus.BOOKED },
            });

            return booking;
        });
        await initializeSocket(io).broadcastSeatStatus(result.eventId, result.seats.map(s => s.id), SeatStatus.BOOKED);
        return result;
    }

    async releaseExpiredReservations() {
        await db.$transaction(async (tx) => {
            // find all expired bookings
            const expiredBookings = await tx.booking.findMany({
                where: {
                    status: BookingStatus.PENDING,
                    createdAt: { lte: new Date(Date.now() - LOCK_DURATION_SECONDS * 1000) },
                    deletedAt: null
                },
                include: {
                    seats: true
                }
            })

            // for each booking change the booking status to CANCELLED and seats' status to AVAILABLE
            for (const booking of expiredBookings) {
                await tx.seat.updateMany({
                    where: {
                        bookingId: booking.id,
                        deletedAt: null
                    },
                    data: {
                        bookingId: null,
                        status: SeatStatus.AVAILABLE
                    }
                });

                await tx.booking.update({
                    where: {
                        id: booking.id,
                        deletedAt: null
                    },
                    data: {
                        status: BookingStatus.CANCELLED
                    }
                })
                await initializeSocket(io).broadcastSeatStatus(booking.eventId, booking.seats.map(s => s.id), SeatStatus.AVAILABLE);
            }
        })
    }
}

export const bookingService = new BookingService();