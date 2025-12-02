export type BillingType = "BOLETO" | "CREDIT_CARD" | "PIX" | "UNDEFINED";

export type PaymentStatus =
    | "PENDING"
    | "RECEIVED"
    | "CONFIRMED"
    | "OVERDUE"
    | "REFUNDED"
    | "RECEIVED_IN_CASH"
    | "REFUND_REQUESTED"
    | "CHARGEBACK_REQUESTED"
    | "CHARGEBACK_DISPUTE"
    | "AWAITING_CHARGEBACK_REVERSAL"
    | "DUNNING_REQUESTED"
    | "DUNNING_RECEIVED"
    | "AWAITING_RISK_ANALYSIS";

export interface AsaasCustomer {
    id?: string;
    name: string;
    cpfCnpj: string;
    email?: string;
    phone?: string;
    mobilePhone?: string;
    address?: string;
    addressNumber?: string;
    complement?: string;
    province?: string;
    postalCode?: string;
    externalReference?: string;
    notificationDisabled?: boolean;
    company?: string;
}

export interface AsaasPayment {
    id?: string;
    customer: string; // ID do cliente
    billingType: BillingType;
    value: number;
    dueDate: string; // formato: YYYY-MM-DD
    description?: string;
    externalReference?: string;
    installmentCount?: number;
    installmentValue?: number;
    discount?: {
        value?: number;
        dueDateLimitDays?: number;
        type?: "FIXED" | "PERCENTAGE";
    };
    interest?: {
        value: number;
    };
    fine?: {
        value: number;
    };
    postalService?: boolean;
    split?: Array<{
        walletId: string;
        fixedValue?: number;
        percentualValue?: number;
    }>;
}

export interface AsaasPaymentResponse {
    id: string;
    customer: string;
    billingType: BillingType;
    value: number;
    netValue: number;
    dueDate: string;
    status: PaymentStatus;
    description: string;
    externalReference: string;
    invoiceUrl: string;
    bankSlipUrl?: string;
    invoiceNumber?: string;
    pixQrCodeId?: string;
    pixCopyAndPaste?: string;
    dateCreated: string;
    originalDueDate: string;
    confirmedDate?: string;
    paymentDate?: string;
    nextDueDate?: string;
}

export interface AsaasWebhookEvent {
    event: string;
    payment: AsaasPaymentResponse;
}

export type SubscriptionCycle = "MONTHLY" | "SEMIANNUALLY" | "YEARLY";

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "OVERDUE" | "INACTIVE";

export interface AsaasSubscription {
    customer: string;
    billingType: BillingType;
    value: number;
    nextDueDate: string; // formato: YYYY-MM-DD
    cycle: SubscriptionCycle;
    description?: string;
    externalReference?: string;
    endDate?: string; // formato: YYYY-MM-DD
    maxPayments?: number;
}

export interface AsaasSubscriptionResponse {
    id: string;
    customer: string;
    billingType: BillingType;
    value: number;
    nextDueDate: string;
    cycle: SubscriptionCycle;
    description: string;
    status: SubscriptionStatus;
    externalReference: string;
    dateCreated: string;
    endDate: string;
    maxPayments?: number;
    invoiceUrl?: string;
}

export interface CreateCreditCardPaymentRepositoryParams {
    customer: string;
    value: number;
    nextDueDate: string;
    cycle: SubscriptionCycle;
    endDate: string;
    description: string;
    remoteIp: string;
    externalReference?: string;
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
}
