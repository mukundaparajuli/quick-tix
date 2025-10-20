import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';
import { InitiatePaymentData, EsewaInitiateResponse, EsewaVerificationData } from '../../types/payment';
import { IPaymentGateway } from '../../../interfaces/IPaymentGateway';

interface EsewaVerificationResponse {
    status: 'Completed' | 'Failed';
    transactionId: string;
    amount: number;
    gatewayData: any;
}

export class EsewaService implements IPaymentGateway {
    private merchantCode: string;
    private secretKey: string;
    private baseURL: string;
    private frontendURL: string;

    constructor() {
        this.merchantCode = process.env.ESEWA_MERCHANT_CODE!;
        this.secretKey = process.env.ESEWA_SECRET_KEY!;
        this.baseURL = process.env.ESEWA_BASE_URL || 'https://rc-epay.esewa.com.np';
        this.frontendURL = process.env.FRONTEND_URL!;
    }

    private generateSignature(message: string): string {
        return crypto.createHash('sha256')
            .update(message)
            .digest('hex');
    }

    async initiatePayment(paymentData: InitiatePaymentData): Promise<EsewaInitiateResponse> {
        const { bookingId, amount, eventName } = paymentData;

        const transactionUUID = `ESEWA_${bookingId}_${Date.now()}`;
        const totalAmount = Math.round(amount); // eSewa uses rupees, not paisa

        const payload = {
            amount: totalAmount,
            tax_amount: 0,
            total_amount: totalAmount,
            transaction_uuid: transactionUUID,
            product_code: this.merchantCode,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: `${process.env.BACKEND_URL}/api/bookings/verify-esewa?bookingId=${bookingId}`,
            failure_url: `${process.env.BACKEND_URL}/api/bookings/verify-esewa?bookingId=${bookingId}&status=failure`,
            signed_field_names: 'total_amount,transaction_uuid,product_code',
        };

        // Generate signature
        const signatureData = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${this.merchantCode}`;
        const signature = this.generateSignature(signatureData);

        return {
            payment_url: `${this.baseURL}/api/epay/main/v2/form`,
            method: 'POST',
            payload: {
                ...payload,
                signature
            },
            transactionId: transactionUUID
        };
    }

    async verifyPayment(verificationData: EsewaVerificationData): Promise<EsewaVerificationResponse> {
        const { data, bookingId } = verificationData;

        try {
            // Verify signature first
            const signatureData = `total_amount=${data.amount},transaction_uuid=${data.transaction_uuid},product_code=${data.product_code},status=${data.status}`;
            const computedSignature = this.generateSignature(signatureData);

            if (computedSignature !== data.signature) {
                throw new Error('Invalid eSewa signature');
            }

            // Verify payment with eSewa API
            const verificationResponse: AxiosResponse = await axios.post(
                `${this.baseURL}/api/epay/transaction/status/${this.merchantCode}`,
                {
                    transaction_uuid: data.transaction_uuid,
                    total_amount: data.amount,
                    product_code: data.product_code
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            return {
                status: data.status === 'COMPLETE' ? 'Completed' : 'Failed',
                transactionId: data.transaction_code || data.transaction_uuid,
                amount: parseFloat(data.amount),
                gatewayData: verificationResponse.data
            };

        } catch (error: any) {
            console.error('eSewa verification error:', error);
            throw new Error(error.response?.data?.message || 'eSewa payment verification failed');
        }
    }
}

export default new EsewaService();