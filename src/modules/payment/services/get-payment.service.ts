import type { AsaasPaymentResponse } from "@/common/interfaces/asaas-props";
import { PaymentRepository } from "@/infra/asaas/repositories/interfaces/payment.repository";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetPaymentService {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(paymentId: string): Promise<AsaasPaymentResponse> {
        try {
            const payment = await this.paymentRepository.getPayment(paymentId);
            return payment;
        } catch (error) {
            throw new NotFoundException("Payment not found");
        }
    }
}
