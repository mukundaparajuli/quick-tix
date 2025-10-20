import axios, { AxiosResponse } from 'axios';
import { InitiatePaymentData, KhaltiInitiateResponse, KhaltiVerificationResponse } from '../../types/payment';
import { IPaymentGateway } from '../../../interfaces/IPaymentGateway';

export class KhaltiService implements IPaymentGateway {
    private secretKey: string;
    private baseURL: string;

    constructor() {
        this.secretKey = process.env.KHALTI_SECRET_KEY!;
        this.baseURL = process.env.KHALTI_BASE_URL || 'https://khalti.com';
    }

    async initiatePayment(paymentData: InitiatePaymentData): Promise<KhaltiInitiateResponse> {
        const payload = {
            return_url: `${process.env.BACKEND_URL}/api/bookings/verify-khalti`,
            website_url: process.env.FRONTEND_URL,
            amount: Math.round(paymentData.amount * 100), // Convert to paisa
            purchase_order_id: paymentData.bookingId.toString(),
            purchase_order_name: `Booking for ${paymentData.eventName}`,
            customer_info: {
                name: paymentData.customerName,
                email: paymentData.customerEmail,
            }
        };

        try {
            const response: AxiosResponse<KhaltiInitiateResponse> = await axios.post(
                `${this.baseURL}/api/v2/epayment/initiate/`,
                payload,
                {
                    headers: {
                        'Authorization': `Key ${this.secretKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Khalti initiation error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detail || 'Khalti payment initiation failed');
        }
    }

    async verifyPayment(pidx: string): Promise<KhaltiVerificationResponse> {
        try {
            const response: AxiosResponse<KhaltiVerificationResponse> = await axios.post(
                `${this.baseURL}/api/v2/epayment/lookup/`,
                { pidx },
                {
                    headers: {
                        'Authorization': `Key ${this.secretKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Khalti verification error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detail || 'Khalti payment verification failed');
        }
    }
}

export default new KhaltiService();