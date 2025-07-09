import axios from 'axios';
import crypto from 'crypto';
import { PaymentProvider, PaymentResult } from '../services/payment.service';

export class EsewaProvider implements PaymentProvider {
    private merchantCode: string;
    private secretKey: string;
    private paymentUrl: string;
    private successUrl: string;
    private failureUrl: string;

    constructor(merchantCode: string, secretKey: string, paymentUrl: string, successUrl: string, failureUrl: string) {
        this.merchantCode = merchantCode;
        this.secretKey = secretKey;
        this.paymentUrl = paymentUrl;
        this.successUrl = successUrl;
        this.failureUrl = failureUrl;
    }

    private generateHash(amount: number, transactionId: string): string {
        const data = `total_amount=${amount},transaction_uuid=${transactionId},product_code=${this.merchantCode}`;
        return crypto.createHmac('sha256', this.secretKey).update(data).digest('base64');
    }

    async processPayment(amount: number, currency: string, description: string, source: string): Promise<PaymentResult> {
        try {
            const transactionId = `txn_${Date.now()}`;
            const signature = this.generateHash(amount, transactionId);

            const paymentData = {
                amount,
                total_amount: amount,
                transaction_uuid: transactionId,
                product_code: this.merchantCode,
                success_url: this.successUrl,
                failure_url: this.failureUrl,
                signed_field_names: 'total_amount,transaction_uuid,product_code',
                signature,
            };

            // eSewa requires a form submission, so return payment data for client-side redirect
            console.log(`eSewa payment initiated: transaction_uuid=${transactionId}`);
            return { success: true, transactionId, data: paymentData };
        } catch (error: any) {
            console.log(`eSewa payment error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
        try {
            // eSewa refund API (contact eSewa support for details)
            console.log('eSewa refund not implemented. Contact eSewa support for refund API.');
            return { success: false, error: 'Refund not supported for eSewa' };
        } catch (error: any) {
            console.log(`eSewa refund error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async verifyPayment(paymentId: string): Promise<PaymentResult> {
        try {
            //TODO: verify the payments
            console.log(`eSewa payment verified: paymentId=${paymentId}`);
            return { success: true, transactionId: paymentId };
        } catch (error: any) {
            console.log(`eSewa verification error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}