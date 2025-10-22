import { PaymentRepository } from "@/infra/asaas/repositories/interfaces/payment.repository";
import type {
    CreateCustomerParams,
    CreateCustomerResponse,
} from "@/modules/payment/use-cases/create-customer.use-case";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateCustomerService {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(data: CreateCustomerParams): Promise<CreateCustomerResponse> {
        const customer = await this.paymentRepository.createCustomer({
            name: data.name,
            cpfCnpj: data.cpfCnpj,
            email: data.email,
            phone: data.phone,
        });

        return customer;
    }
}
