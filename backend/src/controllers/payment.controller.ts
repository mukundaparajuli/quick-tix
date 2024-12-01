import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import { paymentVerification } from "../services"
import db from "../config/db";
import logger from "../logger";
import ApiError from "../types/api-error";

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {

    const { pidx, bookingId } = req.body;
    if (!pidx) {
        throw new ApiError(404, "pidx value not available")
    }

    try {

        const paymentDetails = await paymentVerification(pidx);

        // Update booking status in the database
        const updatedBooking = await db.booking.update({
            where: { id: bookingId },
            data: {
                status: "SUCCESSFUL",
                // paymentDetails: paymentDetails, 
            },
        });

        logger.info("Payment verified and booking updated", { bookingId });

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            booking: updatedBooking,
        });
    } catch (error: any) {
        logger.error("Payment verification failed", { error });
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});


