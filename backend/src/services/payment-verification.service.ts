import ApiError from "../types/api-error";
import logger from "../logger";

const verifyKhaltiPayment = async (pidx: string): Promise<any> => {
    const KHALTI_SECRET_KEY = process.env.KHALTI_LIVE_SECRET_KEY;
    console.log(KHALTI_SECRET_KEY);
    console.log("pidx=", pidx);

    const payload = { pidx };
    const json = JSON.stringify(payload);
    console.log(json);


    try {
        const response = await fetch(
            "https://a.khalti.com/api/v2/epayment/lookup/",
            {
                headers: {
                    "Authorization": `Key ${KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(payload),
            }
        );

        const jsonResponse = await response.json();

        if (!response.ok) {
            console.log("payment failed:", jsonResponse);
            throw new Error(`Failed to verify payment: ${jsonResponse.message || response.statusText}`);
        }

        console.log("response=", jsonResponse);
        return jsonResponse;
    } catch (error: any) {
        console.log("Error verifying payment:", error.message || error);
        logger.error("Payment verification failed", { error });
        throw new ApiError(400, "Payment verification failed");
    }
};

export default verifyKhaltiPayment;
