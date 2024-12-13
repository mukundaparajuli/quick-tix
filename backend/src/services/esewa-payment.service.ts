import { generateEsewaSignature } from "../utils/generate-esewa-signature";

interface EsewaConfigInterface {
    amount: number;
    tax_amount: number;
    total_amount: number;
    transaction_uuid: string;
    product_code: string;
    product_service_charge: number;
    product_delivery_charge: number;
    success_url: string;
    failure_url: string;
    signed_field_names: string;
}

export default async function esewaPaymentInitialization({ amount, transactionUuid }: {
    amount: number;
    transactionUuid: string;
}): Promise<any> {
    const merchantCode = process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (!merchantCode) {
        throw new Error("Esewa Merchant Code is not defined in environment variables.");
    }

    const esewaConfig: EsewaConfigInterface = {
        amount,
        tax_amount: 0,
        total_amount: amount,
        transaction_uuid: transactionUuid,
        product_code: merchantCode,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${baseUrl}/success?method=esewa`,
        failure_url: `${baseUrl}`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    const signatureString = `total_amount=${esewaConfig.total_amount}&transaction_uuid=${esewaConfig.transaction_uuid}&product_code=${esewaConfig.product_code}`;
    const signature = generateEsewaSignature(
        process.env.ESEWA_SECRET_KEY!,
        signatureString
    );

    const esewaPayload = {
        ...esewaConfig,
        signature,
    };

    try {
        const response = await fetch('https://rc-epay.esewa.com.np/api/epay/main/v2/form', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(esewaPayload),
        });

        if (!response.ok) {
            throw new Error(`Esewa API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Return response to the caller
    } catch (error) {
        throw new Error(`Esewa payment initialization failed: ${error}`);
    }
}
