import { PaymentRepository } from "@/infra/asaas/repositories/interfaces/payment.repository";
import type {
    CreatePaymentParams,
    CreatePaymentResponse,
} from "@/modules/payment/use-cases/create-payment.use-case";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreatePaymentService {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(data: CreatePaymentParams): Promise<CreatePaymentResponse> {
        const payment = await this.paymentRepository.createPayment({
            customer: data.customerId,
            billingType: data.billingType,
            value: data.value,
            dueDate: data.dueDate,
            description: data.description,
            externalReference: data.externalReference,
        });

        if (data.billingType === "PIX") {
            const pixQrCode = await this.paymentRepository.getPixQrCode(
                payment.id,
            );
            return {
                ...payment,
                pixCopyAndPaste: pixQrCode.payload,
            };
        }

        return payment;
    }
}
