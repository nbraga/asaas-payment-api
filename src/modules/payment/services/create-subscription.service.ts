import type { AsaasSubscriptionResponse } from "@/common/interfaces/asaas-props";
import { PaymentRepository } from "@/infra/asaas/repositories/interfaces/payment.repository";
import { Injectable } from "@nestjs/common";
import type { CreateSubscriptionDto } from "../dto/create-subscription.dto";

@Injectable()
export class CreateSubscriptionService {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(
        data: CreateSubscriptionDto,
    ): Promise<AsaasSubscriptionResponse> {
        // Cria ou obtém o cliente
        let customerId = data.customerId;

        if (!customerId) {
            if (
                !data.customerName ||
                !data.customerCpfCnpj ||
                !data.customerEmail
            ) {
                throw new Error(
                    "Para criar um novo cliente, name, cpfCnpj e email são obrigatórios",
                );
            }

            const customer = await this.paymentRepository.createCustomer({
                name: data.customerName,
                cpfCnpj: data.customerCpfCnpj,
                email: data.customerEmail,
                phone: data.customerPhone,
            });

            customerId = customer.id!;
        }

        // Cria a assinatura
        const subscription = await this.paymentRepository.createSubscription({
            customer: customerId,
            billingType: data.billingType,
            value: data.value,
            nextDueDate: data.nextDueDate,
            cycle: data.cycle,
            description: data.description,
            externalReference: data.externalReference,
            endDate: data.endDate,
            maxPayments: data.maxPayments,
        });

        return subscription;
    }
}
