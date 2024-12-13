
interface EsewaPaymentPayload {
    amount: number; // Amount for the transaction
    tax_amount: string; // Tax amount as a string, usually "0"
    total_amount: number; // Total transaction amount
    transaction_uuid: string; // Unique identifier for the transaction
    product_code: string; // Merchant code from the environment variable
    product_service_charge: string; // Service charge, usually "0"
    product_delivery_charge: string; // Delivery charge, usually "0"
    success_url: string; // URL to redirect to on success
    failure_url: string; // URL to redirect to on failure
    signed_field_names: string; // Comma-separated field names for signing
}



import { Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import { generateEsewaSignature } from "../utils/generate-esewa-signature";
import ApiResponse from "../types/api-response";

export const esewaPaymentInitialiton = asyncHandler(async (req: Request, res: Response) => {
    const { amount, transactionUuid } = req.body;
    const esewaPayload: EsewaPaymentPayload = {
        amount: 0,
        tax_amount: "0",
        total_amount: 0,
        transaction_uuid: transactionUuid,
        product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || "",
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?method=esewa`,
        failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    const signatureString = `total_amount=${esewaPayload.total_amount},transaction_uuid=${esewaPayload.transaction_uuid},product_code=${esewaPayload.product_code}`;
    const signature = generateEsewaSignature(
        process.env.ESEWA_SECRET_KEY!,
        signatureString
    );

    console.log("eSewa config:", { ...esewaPayload, signature });
    const palyload = {
        amount: amount,
        esewaPayload: {
            ...esewaPayload,
            signature,
            product_service_charge: Number(esewaPayload.product_service_charge),
            product_delivery_charge: Number(
                esewaPayload.product_delivery_charge
            ),
            tax_amount: Number(esewaPayload.tax_amount),
            total_amount: Number(esewaPayload.total_amount),
        }
    }


    // fetch post on esewa api

    const response = await fetch('https://rc-epay.esewa.com.np/api/epay/main/v2/form', {
        method: 'POST',
        body: JSON.stringify(palyload),
    })
    const data = await response.json();
    console.log(data);

    return new ApiResponse(res, 200, "payment data is here: ", data, null);
})