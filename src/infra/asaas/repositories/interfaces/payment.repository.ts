import type {
    AsaasCustomer,
    AsaasPayment,
    AsaasPaymentResponse,
    AsaasSubscription,
    AsaasSubscriptionResponse,
    CreateCreditCardPaymentRepositoryParams,
} from "@/common/interfaces/asaas-props";
import { BillingType, CycleType } from "../../../../../generated/prisma";

export interface PaymentRepositoryParams {
    customer?: string;
    status?: string;
    offset?: number;
    limit?: number;
    subscription?: string;
}

export interface PaymentRepositoryResponse {
    pix: {
        encodedImage: string;
        payload: string;
        expirationDate: string;
    };
    creditCard: null;
    bankSlip: {
        identificationField: string;
        nossoNumero: string;
        barCode: string;
        daysAfterDueDateToRegistrationCancellation: null;
        bankSlipUrl: string;
    } | null;
}

export interface ParamsUpdateSubscriptionRepository {
    id: string;
    billingType?: "PIX" | "BOLETO";
    status?: "ACTIVE" | "INACTIVE";
    nextDueDate?: string;
    cycle?: CycleType;
    updatePendingPayments?: boolean;
}

export interface ParamsUpdateCreditCardSubscriptionRepository {
    id: string;
    creditCard: {
        holderName: string;
        number: string;
        expiryMonth: string;
        expiryYear: string;
        ccv: string;
    };
    creditCardHolderInfo: {
        name: string;
        email: string;
        cpfCnpj: string;
        postalCode: string;
        addressNumber: string;
        phone: string;
        addressComplement?: string;
    };
    remoteIp: string;
}

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

    abstract listPayments(params?: PaymentRepositoryParams): Promise<{
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

    abstract createCreditCardPayment(
        params: CreateCreditCardPaymentRepositoryParams,
    ): Promise<AsaasPaymentResponse>;

    abstract payWithCreditCard(
        paymentId: string,
        creditCardData: {
            creditCard: {
                holderName: string;
                number: string;
                expiryMonth: string;
                expiryYear: string;
                ccv: string;
            };
            creditCardHolderInfo: {
                name: string;
                email: string;
                cpfCnpj: string;
                postalCode: string;
                addressNumber: string;
                addressComplement?: string;
                phone: string;
            };
            remoteIp?: string;
        },
    ): Promise<AsaasPaymentResponse>;

    abstract getInfoPayment(
        paymentId: string,
    ): Promise<PaymentRepositoryResponse>;

    abstract updateSubscription(
        params: ParamsUpdateSubscriptionRepository,
    ): Promise<void>;

    abstract updateCreditCardSubscription(
        params: ParamsUpdateCreditCardSubscriptionRepository,
    ): Promise<AsaasPaymentResponse>;

    abstract updateBillingTypeSubscription({
        subscriptionId,
        billingType,
    }: {
        subscriptionId: string;
        billingType: BillingType;
    }): Promise<AsaasPaymentResponse>;
}
