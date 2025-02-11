// import { PrismaClient, BookingStatus } from "@prisma/client";
import logger from "../logger";
// import db from "../config/db";


interface PaymentPayload {
    return_url: string;
    website_url: string;
    amount: number;
    purchase_order_id: string;
    purchase_order_name: string;
    customer_info: {
        name: string;
        email: string;
    };
}

const initiateKhaltiPayment = async (tx: any, bookingId: number, user: any) => {
    console.log("bookignid=", bookingId);
    const booking = await tx.booking.findUnique({
        where: { id: bookingId },
    });
    console.log(booking);

    if (!booking) {
        throw new Error("Booking not found");
    }

    const KHALTI_LIVE_SECRET_KEY = process.env.KHALTI_LIVE_SECRET_KEY;
    if (!KHALTI_LIVE_SECRET_KEY) {
        throw new Error("Khalti live secret key is missing");
    }

    const RETURN_URL = process.env.KHALTI_RETURN_URL;
    const WEBSITE_URL = process.env.KHALTI_WEBSITE_URL;

    if (!RETURN_URL || !WEBSITE_URL) {
        console.log("ru=", RETURN_URL);
        console.log(WEBSITE_URL);
        throw new Error("Khalti return URL or website URL is missing");
    }

    const payload: PaymentPayload = {
        return_url: RETURN_URL,
        website_url: WEBSITE_URL,
        amount: 70000,
        purchase_order_id: booking.id.toString(),
        purchase_order_name: `Booking for event id: ${booking.id}`,
        customer_info: {
            name: user.fullName,
            email: user.email,
        },
    };

    const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
        headers: {
            "Authorization": `Key ${KHALTI_LIVE_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        console.log(await response.json())
        const errorDetails = await response.json();
        logger.error("Khalti payment initiation error:", errorDetails);
        throw new Error(
            `Failed to initiate payment: ${errorDetails.message || "Unknown error"}`
        );
    }

    const paymentResponse = await response.json();

    // Create payment record in the database
    const payment = await tx.payment.create({
        data: {
            bookingId: booking.id,
            amount: booking.totalPrice,
            paymentProvider: "KHALTI",
            paymentStatus: "PENDING",
            transactionId: paymentResponse.pidx || "",
            paymentResponse: paymentResponse,
        },
    });
    console.log("payment=", payment);

    return payment;
};


export default initiateKhaltiPayment;