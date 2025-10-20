import { InitiatePaymentData } from "../src/types/payment";

export interface IPaymentGateway {
    initiatePayment(paymentData: InitiatePaymentData): Promise<any>;
    verifyPayment(verificationData: any): Promise<any>;
}