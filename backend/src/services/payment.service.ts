import { env } from "../config/env.config";
import { EsewaProvider } from "../providers/esewa-provider";
import { KhaltiProvider } from "../providers/khalti-provider";

export interface PaymentProvider {
    processPayment(amount: number, currency: string, description: string, source: string): Promise<PaymentResult>;
    refundPayment(paymentId: string, amount?: number): Promise<PaymentResult>;
    verifyPayment(paymentId: string): Promise<PaymentResult>;
}

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
    data?: any;
}

export class PaymentService {
    private providers: Map<string, PaymentProvider>;

    constructor() {
        this.providers = new Map<string, PaymentProvider>();
        this.initializeProviders();
    }

    private initializeProviders() {
        this.providers.set('khalti', new KhaltiProvider(env.KHALTI_LIVE_PUBLIC_KEY, env.KHALTI_LIVE_SECRET_KEY, env.KHALTI_PAYMENT_URL, env.KHALTI_LOOKUP_URL));
        this.providers.set('esewa', new EsewaProvider(env.ESEWA_MERCHANT_CODE, env.ESEWA_SECRET_KEY, env.ESEWA_PAYMENT_URL, env.SUCCESS_URL, env.FAILURE_URL));
    }


    async processPayment(providerName: string, amount: number, currency: string, description: string, source: string): Promise<PaymentResult> {
        const provider = this.providers.get(providerName);
        if (!provider) {
            console.log(`Payment provider ${providerName} not found`);
            return { success: false, error: 'Payment provider not found' };
        }
        const result = provider.processPayment(amount, currency, description, source);
        console.log(`Payment processed with provider: ${providerName}, result: ${JSON.stringify(result)}`);
        return result;
    }

    async refundPayment(providerName: string, paymentId: string, amount?: number): Promise<PaymentResult> {
        const provider = this.providers.get(providerName);
        if (!provider) {
            console.log(`Payment provider ${providerName} not found for refund`);
            return { success: false, error: 'Payment provider not found' };
        }
        const result = provider.refundPayment(paymentId, amount);
        return result
    }

    async verifyPayment(providerName: string, transactionId: string, extraData?: string): Promise<PaymentResult> {
        const provider = this.providers.get(providerName);
        if (!provider || !['khalti', 'esewa'].includes(providerName)) {
            console.log(`Payment provider ${providerName} not found or verification not supported`);
            throw new Error(`Unsupported payment provider for verification: ${providerName}`);
        }

        console.log(`Verifying payment with ${providerName} for transaction ${transactionId}`);
        let result: PaymentResult;
        if (providerName === 'khalti') {
            result = await (provider as KhaltiProvider).verifyPayment(transactionId);
        } else {
            result = await (provider as unknown as EsewaProvider).verifyPayment(transactionId);
        }
        console.log(`Verification result: ${JSON.stringify(result)}`);
        return result;
    }
}