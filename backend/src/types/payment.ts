

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED'
}

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED'
}

export interface InitiatePaymentData {
    bookingId: number;
    amount: number;
    eventName: string;
    customerName: string;
    customerEmail: string;
}

export interface KhaltiInitiateResponse {
    pidx: string;
    payment_url: string;
    expires_at: string;
    expires_in: number;
}

export interface KhaltiVerificationResponse {
    status: 'Completed' | 'Pending' | 'Expired' | 'Failed';
    transaction_id: string;
    total_amount: number;
    refunded: boolean;
}

export interface EsewaInitiateResponse {
    payment_url: string;
    method: 'POST';
    payload: EsewaPayload;
    transactionId: string;
}

export interface EsewaPayload {
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
    signature: string;
}

export interface EsewaVerificationData {
    data: any;
    bookingId: number;
}

export interface PaymentGateway {
    initiatePayment(paymentData: InitiatePaymentData): Promise<any>;
    verifyPayment(verificationData: any): Promise<any>;
}