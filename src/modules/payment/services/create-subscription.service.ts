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
import {
    calculateSubscriptionEndDate,
    formatSubscriptionEndDate,
} from "@/utils/calculate-subscription-end-date";
import { calculateTotalPrice } from "@/utils/value-monthly";
import { Injectable } from "@nestjs/common";
const dayjs = require("dayjs");

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
                billingType: data.paymentData.billingType,
                last4CardDigits: data.paymentData.creditCard!.number.slice(-4),
            });

        subscriptionId = subscription.id;

        if (data.paymentData.billingType === "CREDIT_CARD") {
            try {
                const assasSubscriptionPayment =
                    await this.asaasPaymentRepository.createCreditCardPayment({
                        customer: customerId,
                        value: calculateTotalPrice(
                            packageData.price,
                            data.paymentData.cycle,
                        ),
                        nextDueDate: dayjs().format("YYYY-MM-DD"),
                        description: `Pagamento de assinatura - ${packageData.name}`,
                        cycle: data.paymentData.cycle,
                        endDate: formatSubscriptionEndDate(
                            data.paymentData.cycle,
                        ),
                        creditCard: data.paymentData.creditCard!,
                        creditCardHolderInfo: {
                            ...data.paymentData.creditCardHolderInfo!,
                            email: user.email,
                            name: user.fullName,
                            cpfCnpj: user.cnpj.replace(/\D/g, ""),
                            phone: user.phone.replace(/\D/g, ""),
                        },
                        externalReference: subscription.id,
                        remoteIp: data.paymentData.remoteIp,
                    });

                if (!assasSubscriptionPayment.id) {
                    await this.subscriptionRepository.hardDeleteSubscription(
                        subscription.id,
                    );
                    return {
                        status: "error",
                        error: "Erro ao criar pagamento",
                    };
                }

                await this.subscriptionRepository.updateSubscription({
                    subscriptionId: subscriptionId,
                    externalRefSubscriptionId: assasSubscriptionPayment.id,
                    nextDueDate: dayjs(
                        assasSubscriptionPayment.nextDueDate,
                    ).toDate(),
                });
            } catch (error) {
                await this.subscriptionRepository.hardDeleteSubscription(
                    subscriptionId,
                );
                const errorMessage =
                    error?.response?.data?.errors?.[0]?.description ||
                    "Erro ao processar pagamento";
                return {
                    status: "error",
                    error: errorMessage,
                };
            }
        } else {
            const subscriptionExists =
                await this.subscriptionRepository.subscriptionExists(
                    user.id,
                    data.paymentData.packageId,
                    data.paymentData.cycle,
                );

            if (subscriptionExists) {
                if (subscriptionExists.status === "ACTIVE") {
                    return {
                        status: "error",
                        error: "Empresa já possui uma assinatura ativa",
                    };
                } else {
                    const payments =
                        await this.asaasPaymentRepository.listPayments({
                            subscription:
                                subscriptionExists.externalRefSubscriptionId!,
                        });

                    const paymentInfo =
                        await this.asaasPaymentRepository.getInfoPayment(
                            payments.data[0].id!,
                        );

                    return {
                        status: "success",
                        data: {
                            ...paymentInfo,
                            subscriptionId: subscriptionExists.id,
                        },
                    };
                }
            }

            const asaasSubscription =
                await this.asaasPaymentRepository.createSubscription({
                    customer: customerId,
                    value: calculateTotalPrice(
                        packageData.price,
                        data.paymentData.cycle,
                    ),
                    nextDueDate: dayjs().format("YYYY-MM-DD"),
                    endDate: formatSubscriptionEndDate(data.paymentData.cycle),
                    description: `Pagamento de assinatura - ${packageData.name}`,
                    cycle: data.paymentData.cycle,
                    billingType: data.paymentData.billingType,
                    externalReference: subscription.id,
                });

            if (!asaasSubscription.id) {
                await this.subscriptionRepository.hardDeleteSubscription(
                    subscription.id,
                );
                return {
                    status: "error",
                    error: "Erro ao criar pagamento",
                };
            }

            await this.subscriptionRepository.updateSubscription({
                subscriptionId: subscriptionId,
                externalRefSubscriptionId: asaasSubscription.id,
                nextDueDate: dayjs(asaasSubscription.nextDueDate).toDate(),
            });

            const payments = await this.asaasPaymentRepository.listPayments({
                subscription: asaasSubscription.id,
            });

            const paymentInfo =
                await this.asaasPaymentRepository.getInfoPayment(
                    payments.data[0].id!,
                );

            return {
                status: "success",
                data: { ...paymentInfo, subscriptionId: subscriptionId },
            };
        }

        return {
            status: "success",
            data: subscriptionId,
        };
    }
}
