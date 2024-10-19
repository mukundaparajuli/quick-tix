import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import logger from "../logger";
import db from "../config/db";
import ApiResponse from "../types/api-response";
import { BookingStatus } from "@prisma/client";

export const makePayment = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.body;
    const user = req.user;

    console.log("User: ", user);

    const booking = await db.booking.findUnique({
        where: { id: Number(bookingId) }
    });

    if (!booking) {
        return new ApiResponse(res, 404, "Booking detail not available", null, null);
    }

    const LIVE_SECRET_KEY = process.env.LIVE_SECRET_KEY;
    if (!LIVE_SECRET_KEY) {
        return new ApiResponse(res, 500, "Khalti live secret key is missing", null, null);
    }

    const initiateKhaltiPayment = async (bookingId: number, amount: number, user: any) => {
        const payload = {
            "return_url": "https://example.com/payment/",
            "website_url": "https://example.com/",
            "amount": 1300,                                                      // we have hardcoded the amount here for developement make sure to change it on production
            "purchase_order_id": bookingId.toString(),
            "purchase_order_name": `Booking for event id: ${bookingId}`,
            "customer_info": {
                "name": user.fullName,
                "email": user.email,
            },
        };

        try {
            const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
                headers: {
                    'Authorization': `Key ${LIVE_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error details:', errorDetails);
                throw new Error(`Failed to initiate payment: ${errorDetails.message || 'Unknown error'}`);
            }

            const paymentResponse = await response.json();
            console.log({ paymentResponse });

            if (paymentResponse && paymentResponse.payment_url) {
                // Update booking status in DB
                await db.booking.update({
                    where: { id: booking.id },
                    data: { status: BookingStatus.SUCCESSFUL }
                });
                return new ApiResponse(res, 200, "Booking made successfully. Proceed to payment.", { booking, paymentUrl: paymentResponse.payment_url }, null);
            } else {
                throw new Error('Payment URL not returned');
            }
        } catch (error) {
            logger.error(error);
            // Optionally delete the booking on failure
            // await db.booking.delete({ where: { id: bookingId } });
            return new ApiResponse(res, 500, "Booking created but payment initiation failed", null, error);
        }
    };

    await initiateKhaltiPayment(booking.id, booking.totalPrice, user);
});
