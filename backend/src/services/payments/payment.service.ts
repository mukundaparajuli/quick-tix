import { IPaymentGateway } from '../../../interfaces/IPaymentGateway';
import { InitiatePaymentData, PaymentMethod } from '../../types/payment';
import esewaService from './esewa.service';
import khaltiService from './khalti.service';

export class PaymentService {
    private gateways: Map<PaymentMethod, IPaymentGateway>;

    constructor() {
        this.gateways = new Map<PaymentMethod, IPaymentGateway>([
            [PaymentMethod.KHALTI, khaltiService],
            [PaymentMethod.ESEWA, esewaService]
        ]);
    }

    getGateway(method: PaymentMethod): IPaymentGateway {
        const gateway = this.gateways.get(method);
        if (!gateway) {
            throw new Error(`Unsupported payment method: ${method}`);
        }
        return gateway;
    }

    async initiatePayment(method: PaymentMethod, paymentData: InitiatePaymentData): Promise<any> {
        const gateway = this.getGateway(method);
        return await gateway.initiatePayment(paymentData);
    }

    async verifyPayment(method: PaymentMethod, verificationData: any): Promise<any> {
        const gateway = this.getGateway(method);
        return await gateway.verifyPayment(verificationData);
    }
}

export default new PaymentService();