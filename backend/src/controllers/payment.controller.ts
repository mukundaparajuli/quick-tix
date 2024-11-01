import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import logger from "../logger";
import db from "../config/db";
import ApiResponse from "../types/api-response";
import { BookingStatus } from "@prisma/client";

export const makePayment = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.body;
    const user = req.user;

    if (!user) {
        return new ApiResponse(res, 404, "User not found!", null, null);
    }

    // Start transaction
    const result = await db.$transaction(async (prisma) => {
        const booking = await prisma.booking.findUnique({
            where: { id: Number(bookingId) }
        });

        if (!booking) {
            throw new Error("Booking detail not available");
        }

        const LIVE_SECRET_KEY = process.env.LIVE_SECRET_KEY;
        if (!LIVE_SECRET_KEY) {
            throw new Error("Khalti live secret key is missing");
        }

        // Move initiateKhaltiPayment logic inside transaction
        const RETURN_URL = process.env.KHALTI_RETURN_URL;
        const WEBSITE_URL = process.env.KHALTI_WEBSITE_URL;

        if (!RETURN_URL || !WEBSITE_URL) {
            throw new Error('Khalti return URL or website URL is missing');
        }

        const payload = {
            "return_url": RETURN_URL,
            "website_url": WEBSITE_URL,
            "amount": booking.totalPrice * 100,
            "purchase_order_id": booking.id.toString(),
            "purchase_order_name": `Booking for event id: ${booking.id}`,
            "customer_info": {
                "name": user.fullName,
                "email": user.email,
            },
        };

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
            logger.error('Khalti payment initiation error:', errorDetails);
            throw new Error(`Failed to initiate payment: ${errorDetails.message || 'Unknown error'}`);
        }

        const paymentResponse = await response.json();

        // Create payment record

        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                amount: booking.totalPrice,
                paymentProvider: 'KHALTI',
                paymentStatus: 'PENDING',
                transactionId: paymentResponse.pidx || '',
                paymentResponse: paymentResponse
            }
        });


        return { booking, paymentResponse };
    }, {
        maxWait: 5000, // maximum time to wait for transaction
        timeout: 10000  // maximum time for transaction to complete
    });

    return new ApiResponse(
        res,
        200,
        "Payment initiated successfully",
        {
            booking: result.booking,
            paymentUrl: result.paymentResponse.payment_url
        },
        null
    );
});
