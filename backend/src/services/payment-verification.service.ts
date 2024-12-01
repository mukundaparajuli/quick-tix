import ApiError from "../types/api-error";
import logger from "../logger";

const verifyKhaltiPayment = async (pidx: string): Promise<any> => {
    const KHALTI_SECRET_KEY = process.env.KHALTI_LIVE_SECRET_KEY;
    console.log(KHALTI_SECRET_KEY);
    try {
        const response = await fetch(
            "https://khalti.com/api/v2/epayment/lookup",
            {
                method: "POST",
                headers: {
                    "Authorization": `Key ${KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pidx
                }),
            }
        );

        if (!response.ok) {
            console.log("payment failed:", await response.json())
            throw new Error(`Failed to verify payment: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // The response contains details about the transaction
    } catch (error: any) {
        console.log(error);
        logger.error("Payment verification failed", { error });
        throw new ApiError(400, "Payment verification failed");
    }
};

export default verifyKhaltiPayment;
