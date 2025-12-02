import { ServiceResponseProps } from "@/common/interfaces/service-response-props";
import { BillingType, CycleType } from "generated/prisma";

export interface CreateSubscriptionPaymentParams {
    packageId: string;
    userId: string;
    cycle: CycleType;
    billingType: BillingType;
    remoteIp: string;
}

export type CreateSubscriptionPaymentErrors =
    | "Pacote não encontrado"
    | "Usuário não encontrado"
    | "Empresa já possui uma assinatura ativa";

export type CreateSubscriptionPaymentResponse = null;

export type CreateSubscriptionPaymentUseCase = ServiceResponseProps<
    CreateSubscriptionPaymentParams,
    CreateSubscriptionPaymentErrors,
    CreateSubscriptionPaymentResponse
>;
