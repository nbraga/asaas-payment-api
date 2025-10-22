import type {
    AsaasCustomer,
    AsaasPayment,
    AsaasPaymentResponse,
    AsaasSubscription,
    AsaasSubscriptionResponse,
} from "@/common/interfaces/asaas-props";

export abstract class PaymentRepository {
    abstract createCustomer(customer: AsaasCustomer): Promise<AsaasCustomer>;

    abstract getCustomer(customerId: string): Promise<AsaasCustomer | null>;

    abstract listCustomers(params?: {
        name?: string;
        email?: string;
        cpfCnpj?: string;
        offset?: number;
        limit?: number;
    }): Promise<{
        data: AsaasCustomer[];
        totalCount: number;
    }>;

    abstract createPayment(
        payment: AsaasPayment,
    ): Promise<AsaasPaymentResponse>;

    abstract getPayment(paymentId: string): Promise<AsaasPaymentResponse>;

    abstract listPayments(params?: {
        customer?: string;
        status?: string;
        offset?: number;
        limit?: number;
    }): Promise<{
        data: AsaasPaymentResponse[];
        totalCount: number;
    }>;

    abstract deletePayment(paymentId: string): Promise<void>;

    abstract getPixQrCode(paymentId: string): Promise<{
        encodedImage: string;
        payload: string;
        expirationDate: string;
    }>;

    abstract createSubscription(
        subscription: AsaasSubscription,
    ): Promise<AsaasSubscriptionResponse>;

    abstract getSubscription(
        subscriptionId: string,
    ): Promise<AsaasSubscriptionResponse>;

    abstract listSubscriptions(params?: {
        customer?: string;
        status?: string;
        offset?: number;
        limit?: number;
    }): Promise<{
        data: AsaasSubscriptionResponse[];
        totalCount: number;
    }>;

    abstract deleteSubscription(subscriptionId: string): Promise<void>;
}
