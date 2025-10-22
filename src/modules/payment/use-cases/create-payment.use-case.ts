export type CreatePaymentParams = {
    customerId: string;
    billingType: "BOLETO" | "CREDIT_CARD" | "PIX" | "UNDEFINED";
    value: number;
    dueDate: string;
    customerName?: string;
    customerCpfCnpj?: string;
    customerEmail?: string;
    customerPhone?: string;
    description?: string;
    externalReference?: string;
};

export type CreatePaymentResponse = any;
