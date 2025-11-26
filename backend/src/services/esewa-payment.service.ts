import crypto from 'crypto';
import { IPaymentGateway } from '../../interfaces/IPaymentGateway';
import { InitiatePaymentData, EsewaInitiateResponse, EsewaPayload, EsewaVerificationData } from '../types/payment';
import { env } from '../config/env.config';
import ApiError from '../types/api-error';
import axios from 'axios';

export class EsewaPaymentService implements IPaymentGateway {
    private readonly merchantCode: string;
    private readonly secretKey: string;
    private readonly paymentUrl: string;

    constructor() {
        this.merchantCode = env.ESEWA_MERCHANT_CODE;
        this.secretKey = env.ESEWA_SECRET_KEY;
        this.paymentUrl = env.ESEWA_PAYMENT_URL;
    }

    private generateSignature(params: any): string {
        const message = `total_amount=${params.total_amount},transaction_uuid=${params.transaction_uuid},product_code=${params.product_code}`;
        const hmac = crypto.createHmac('sha256', this.secretKey);
        hmac.update(message);
        const signature = hmac.digest('base64');
        return signature;
    }

    private generateTransactionUuid(): string {
        return `txn-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }

    async initiatePayment(paymentData: InitiatePaymentData): Promise<EsewaInitiateResponse> {
        try {
            const transactionUuid = this.generateTransactionUuid();
            const amount = Math.round(paymentData.amount);
            const taxAmount = 0; // You can calculate tax if needed
            const serviceCharge = 0;
            const deliveryCharge = 0;
            const totalAmount = amount + taxAmount + serviceCharge + deliveryCharge;

            const payload: EsewaPayload = {
                amount: amount,
                tax_amount: taxAmount,
                total_amount: totalAmount,
                transaction_uuid: transactionUuid,
                product_code: this.merchantCode,
                product_service_charge: serviceCharge,
                product_delivery_charge: deliveryCharge,
                success_url: `${env.SUCCESS_URL}/esewa?booking_id=${paymentData.bookingId}&transaction_uuid=${transactionUuid}`,
                failure_url: `${env.FAILURE_URL}?booking_id=${paymentData.bookingId}&transaction_uuid=${transactionUuid}`,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                signature: ""
            };

            // Generate signature
            payload.signature = this.generateSignature(payload);

            return {
                payment_url: this.paymentUrl,
                method: 'POST',
                payload,
                transactionId: transactionUuid
            };
        } catch (error: any) {
            console.error('eSewa payment initiation error:', error.message);
            throw new ApiError(500, `eSewa payment initiation failed: ${error.message}`);
        }
    }

    async verifyPayment(verificationData: EsewaVerificationData): Promise<any> {
        try {
            const { data } = verificationData;

            if (!data.transaction_uuid || !data.total_amount) {
                throw new ApiError(400, 'Invalid verification data from eSewa');
            }

            // First, verify the signature
            const expectedSignature = this.generateSignature({
                total_amount: data.total_amount,
                transaction_uuid: data.transaction_uuid,
                product_code: this.merchantCode
            });

            if (data.signature && data.signature !== expectedSignature) {
                throw new ApiError(400, 'Invalid signature from eSewa');
            }

            // Then, verify with eSewa's API
            const statusCheckResponse = await this.makeEsewaStatusCheck(data.transaction_uuid, data.total_amount);

            if (statusCheckResponse.status !== 'Success') {
                throw new ApiError(400, 'Payment verification failed with eSewa');
            }

            return {
                status: 'Completed',
                transaction_id: data.transaction_uuid,
                total_amount: parseFloat(data.total_amount),
                verified: true,
                gateway_response: data
            };
        } catch (error: any) {
            console.error('eSewa payment verification error:', error.message);
            throw new ApiError(500, `eSewa payment verification failed: ${error.message}`);
        }
    }

    async handleCallback(callbackData: any): Promise<any> {
        return this.verifyPayment({ data: callbackData });
    }

    private async makeEsewaStatusCheck(transactionUuid: string, totalAmount: string): Promise<any> {
        try {
            // eSewa verification API endpoint (use production URL in production)
            const verificationUrl = env.ESEWA_VERIFICATION_URL || 'https://uat.esewa.com.np/api/epay/transaction/status/';

            const payload: any = {
                product_code: this.merchantCode,
                total_amount: totalAmount,
                transaction_uuid: transactionUuid
            };

            // Generate signature for verification
            const signature = this.generateSignature(payload);
            payload.signature = signature;

            const response = await axios.post(verificationUrl, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // eSewa returns status in response
            if (response.data && response.data.status === 'COMPLETE') {
                return {
                    status: 'Success',
                    message: 'Payment verified successfully',
                    data: response.data
                };
            } else {
                return {
                    status: 'Failed',
                    message: 'Payment not completed',
                    data: response.data
                };
            }
        } catch (error: any) {
            console.error('eSewa status check error:', error);
            throw new ApiError(500, 'Failed to verify payment with eSewa');
        }
    }
}

export const esewaPaymentService = new EsewaPaymentService();