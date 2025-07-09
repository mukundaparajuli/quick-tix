import axios from "axios";
import { PaymentProvider, PaymentResult, PaymentService } from "../services/payment.service";
import { env } from "../config/env.config";


export class KhaltiProvider implements PaymentProvider {
    private paymentUrl: string;
    private lookupUrl: string;
    private secretKey: string;

    constructor(publicKey: string, secretKey: string, paymentUrl: string, lookupUrl: string) {
        this.paymentUrl = paymentUrl;
        this.lookupUrl = lookupUrl;
        this.secretKey = secretKey;
    }

    async processPayment(amount: number, currency: string, description: string, source: string): Promise<PaymentResult> {
        try {
            const response = await axios.post(
                this.paymentUrl,
                {
                    return_url: env.SUCCESS_URL,
                    website_url: env.FRONTEND_URL,
                    amount: Math.round(amount * 100), // Convert to paisa
                    purchase_order_id: `order_${Date.now()}`,
                    purchase_order_name: description,
                    customer_info: {
                        //meta deta here
                        phone: source,
                    },
                },
                {
                    headers: {
                        Authorization: `Key ${this.secretKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.pidx) {
                console.log(`Khalti payment initiated: pidx=${response.data.pidx}`)
                return { success: true, transactionId: response.data.pidx };
            }
            return { success: false, error: 'Failed to initiate khalti payment' };
        } catch (error: any) {
            console.log(`Khalti payment error: ${error.message}`);
            return { success: false, error: error.message }
        }
    }

    async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
        try {
            return { success: false, error: 'Refund is not supported for khalti' }
        } catch (error: any) {
            return { success: false, error: error.message }
        }
    }

    async verifyPayment(paymentId: string): Promise<PaymentResult> {
        try {
            const response = await axios.post(
                this.lookupUrl,
                { pidx: paymentId },
                {
                    headers: {
                        Authorization: `Key ${this.secretKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status === "Completed") {
                console.log(`Khalti payment verified: pidx = ${paymentId}`)
                return { success: true, transactionId: paymentId }
            }
            return { success: false }
        } catch (error: any) {
            console.log(`Khalti payment verification failed: ${error.message}`);
            return { success: false, error: error.message }
        }
    }
}