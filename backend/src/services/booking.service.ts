import { Request } from "express";
import db from "../config/db";
import { BookingStatus, DiscountType, SeatStatus } from "@prisma/client";
import ApiError from "../types/api-error";

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
        })
    }
}