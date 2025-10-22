import type { AsaasCustomer } from "@/common/interfaces/asaas-props";
import { PaymentRepository } from "@/infra/asaas/repositories/interfaces/payment.repository";
import { Injectable } from "@nestjs/common";
import type { ListCustomersDto } from "../dto/list-customers.dto";

@Injectable()
export class ListCustomersService {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(params: ListCustomersDto): Promise<{
        data: AsaasCustomer[];
        totalCount: number;
        hasMore: boolean;
    }> {
        const result = await this.paymentRepository.listCustomers(params);

        return {
            data: result.data,
            totalCount: result.totalCount,
            hasMore: result.data.length === params.limit,
        };
    }
}
