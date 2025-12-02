import { PaymentRepository } from "@/infra/asaas/repositories/interfaces/payment.repository";
import { PackageRepository } from "@/infra/prisma/repositories/interfaces/package.repository";
import { SubscriptionRepository } from "@/infra/prisma/repositories/interfaces/subscription.repository";
import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import {
    CreateSubscriptionPaymentErrors,
    CreateSubscriptionPaymentParams,
    CreateSubscriptionPaymentResponse,
    CreateSubscriptionPaymentUseCase,
} from "@/modules/payment/use-cases/create-subscription.use-case";
import { calculateSubscriptionEndDate } from "@/utils/calculate-subscription-end-date";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateSubscriptionService
    implements CreateSubscriptionPaymentUseCase
{
    constructor(
        private readonly asaasPaymentRepository: PaymentRepository,
        private readonly packageRepository: PackageRepository,
        private readonly userRepository: UserRepository,
        private readonly subscriptionRepository: SubscriptionRepository,
    ) {}

    async execute(
        data: CreateSubscriptionPaymentParams,
    ): Promise<
        | { status: "success"; data: CreateSubscriptionPaymentResponse }
        | { status: "error"; error: CreateSubscriptionPaymentErrors }
    > {
        let customerId = "";
        let subscriptionId = "";

        const [user, packageData] = await Promise.all([
            this.userRepository.findById(data.userId),
            this.packageRepository.findOne(data.paymentData.packageId),
        ]);

        if (!user) {
            return {
                status: "error",
                error: "Usuário não encontrado",
            };
        }

        if (!packageData) {
            return {
                status: "error",
                error: "Pacote não encontrado",
            };
        }

        const customer = await this.asaasPaymentRepository.listCustomers({
            cpfCnpj: user.cnpj.replace(/\D/g, ""),
        });

        /* Se não houver cliente, cria um novo */
        if (customer.data.length === 0) {
            const customer = await this.asaasPaymentRepository.createCustomer({
                name: user.fullName,
                email: user.email,
                cpfCnpj: user.cnpj.replace(/\D/g, ""),
            });

            customerId = customer.id!;
        } else {
            customerId = customer.data[0].id!;
        }
        /*  */

        const subscription =
            await this.subscriptionRepository.createSubscription({
                packageId: data.paymentData.packageId,
                userId: user.id,
                cycle: data.paymentData.cycle,
                status: "PENDING",
                endDate: calculateSubscriptionEndDate(data.paymentData.cycle),
                billingType: "CREDIT_CARD",
                last4CardDigits: data.paymentData.creditCard!.number.slice(-4),
            });

        subscriptionId = subscription.id;

        if (data.paymentData.billingType === "CREDIT_CARD") {
        } else {
        }

        console.log("🚀 ~ CreateSubscriptionService ~ execute ~ data:", data);
        return {
            status: "success",
            data: null,
        };
    }
}
