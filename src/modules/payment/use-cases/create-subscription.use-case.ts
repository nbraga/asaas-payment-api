import { ServiceResponseProps } from "@/common/interfaces/service-response-props";
import { BillingType, CycleType } from "generated/prisma";

export interface CreateSubscriptionPaymentParams {
    userId: string;
    paymentData: {
        packageId: string;
        cycle: CycleType;
        billingType: BillingType;
        remoteIp: string;
        creditCard?: {
            holderName: string;
            number: string;
            expiryMonth: string;
            expiryYear: string;
            ccv: string;
        };
        creditCardHolderInfo?: {
            postalCode: string;
            addressNumber: string;
            addressComplement?: string;
        };
    };
}

export type CreateSubscriptionPaymentErrors =
    | "Pacote não encontrado"
    | "Usuário não encontrado"
    | "Erro ao criar pagamento"
    | "Empresa já possui uma assinatura ativa";

export type CreateSubscriptionPaymentResponse = any;

export type CreateSubscriptionPaymentUseCase = ServiceResponseProps<
    CreateSubscriptionPaymentParams,
    CreateSubscriptionPaymentErrors,
    CreateSubscriptionPaymentResponse
>;
