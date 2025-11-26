import axios, { AxiosResponse } from 'axios';
import { IPaymentGateway } from '../../interfaces/IPaymentGateway';
import { InitiatePaymentData, KhaltiInitiateResponse, KhaltiVerificationResponse } from '../types/payment';
import { env } from '../config/env.config';
import ApiError from '../types/api-error';

export class KhaltiPaymentService implements IPaymentGateway {
    private readonly secretKey: string;
    private readonly paymentUrl: string;
    private readonly lookupUrl: string;

    constructor() {
        this.secretKey = env.KHALTI_LIVE_SECRET_KEY;
        this.paymentUrl = env.KHALTI_PAYMENT_URL;
        this.lookupUrl = env.KHALTI_LOOKUP_URL;
    }

    async initiatePayment(paymentData: InitiatePaymentData): Promise<KhaltiInitiateResponse> {
        try {
            const payload = {
                return_url: `${env.SUCCESS_URL}/khalti`,
                website_url: env.FRONTEND_URL,
                amount: Math.round(paymentData.amount * 100),
                purchase_order_id: `booking-${paymentData.bookingId}-${Date.now()}`,
                purchase_order_name: `${paymentData.eventName} - Ticket Booking`,
                customer_info: {
                    name: paymentData.customerName,
                    email: paymentData.customerEmail,
                }
            };

            const response: AxiosResponse<KhaltiInitiateResponse> = await axios.post(
                this.paymentUrl,
                payload,
                {
                    headers: {
                        'Authorization': `Key ${this.secretKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.data.pidx) {
                throw new ApiError(500, 'Failed to initiate Khalti payment');
            }

            return response.data;
        } catch (error: any) {
            console.error('Khalti payment initiation error:', error.response?.data || error.message);
            throw new ApiError(
                500,
                `Khalti payment initiation failed: ${error.response?.data?.detail || error.message}`
            );
        }
    }

    async verifyPayment(verificationData: { pidx: string }): Promise<KhaltiVerificationResponse> {
        try {
            if (!verificationData.pidx) {
                throw new ApiError(400, 'Payment index (pidx) is required for verification');
            }

            const response: AxiosResponse<KhaltiVerificationResponse> = await axios.post(
                this.lookupUrl,
                { pidx: verificationData.pidx },
                {
                    headers: {
                        'Authorization': `Key ${this.secretKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Khalti payment verification error:', error.response?.data || error.message);
            throw new ApiError(
                500,
                `Khalti payment verification failed: ${error.response?.data?.detail || error.message}`
            );
        }
    }

    async handleCallback(pidx: string): Promise<KhaltiVerificationResponse> {
        return this.verifyPayment({ pidx });
    }
}

export const khaltiPaymentService = new KhaltiPaymentService();