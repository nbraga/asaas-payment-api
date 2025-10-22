import type { AsaasSubscriptionResponse } from "@/common/interfaces/asaas-props";
import { PaymentRepository } from "@/infra/asaas/repositories/interfaces/payment.repository";
import { Injectable } from "@nestjs/common";
import type { ListSubscriptionsDto } from "../dto/list-subscriptions.dto";

@Injectable()
export class ListSubscriptionsService {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async execute(params: ListSubscriptionsDto): Promise<{
        data: AsaasSubscriptionResponse[];
        totalCount: number;
        hasMore: boolean;
    }> {
        const result = await this.paymentRepository.listSubscriptions(params);

        return {
            ...result,
            hasMore: result.data.length === params.limit,
        };
    }
}
