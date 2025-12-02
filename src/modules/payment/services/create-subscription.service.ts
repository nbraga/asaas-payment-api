import { PaymentRepository } from "@/infra/asaas/repositories/interfaces/payment.repository";
import {
    CreateSubscriptionPaymentErrors,
    CreateSubscriptionPaymentParams,
    CreateSubscriptionPaymentResponse,
    CreateSubscriptionPaymentUseCase,
} from "@/modules/payment/use-cases/create-subscription.use-case";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateSubscriptionService
    implements CreateSubscriptionPaymentUseCase
{
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(
        data: CreateSubscriptionPaymentParams,
    ): Promise<
        | { status: "success"; data: CreateSubscriptionPaymentResponse }
        | { status: "error"; error: CreateSubscriptionPaymentErrors }
    > {
        return {
            status: "success",
            data: null,
        };
    }
}
