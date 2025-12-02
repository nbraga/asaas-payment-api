import { PrismaService } from "@/infra/prisma/prisma.service";
import {
    ParamsCreateSubscriptionRepository,
    ParamsUpdateSubscriptionRepository,
    ResponsefindSubscriptionByIdRepository,
    SubscriptionProps,
    SubscriptionRepository,
} from "@/infra/prisma/repositories/interfaces/subscription.repository";
import { Injectable } from "@nestjs/common";
import { BillingType, CycleType } from "generated/prisma";

@Injectable()
export class PrismaSubscriptionRepository extends SubscriptionRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async createSubscription(
        params: ParamsCreateSubscriptionRepository,
    ): Promise<Omit<SubscriptionProps, "package">> {
        const subscription = await this.prisma.subscription.create({
            data: {
                endDate: params.endDate,
                packageId: params.packageId,
                status: params.status,
                cycle: params.cycle,
                billingType: params.billingType,
                last4CardDigits: params.last4CardDigits || null,
                userId: params.userId,
            },
        });

        return subscription;
    }

    async updateSubscription(
        params: ParamsUpdateSubscriptionRepository,
    ): Promise<Omit<SubscriptionProps, "package">> {
        const { subscriptionId, ...dataToUpdate } = params;

        const subscription = await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: dataToUpdate,
        });

        return subscription;
    }

    async softDeleteSubscription(id: string): Promise<void> {
        await this.prisma.subscription.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async hardDeleteSubscription(id: string): Promise<void> {
        await this.prisma.subscription.delete({
            where: { id },
        });
    }

    async subscriptionExists(
        userId: string,
        packageId: string,
        cycle: CycleType,
    ): Promise<Omit<SubscriptionProps, "package"> | null> {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                packageId,
                cycle,
                status: {
                    in: ["PENDING", "ACTIVE"],
                },
                deletedAt: null,
            },
        });

        if (!subscription) {
            return null;
        }

        return subscription;
    }

    async updateSubscriptionExternalRef(
        subscriptionId: string,
        externalRefSubscriptionId: string,
    ): Promise<void> {
        await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: { externalRefSubscriptionId },
        });
    }

    async findSubscriptionByExternalRef(
        externalReference: string,
    ): Promise<Omit<SubscriptionProps, "package"> | null> {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                OR: [
                    { id: externalReference },
                    { externalRefSubscriptionId: externalReference },
                ],
                deletedAt: null,
            },
        });

        return subscription;
    }

    async findSubscriptionById(
        id: string,
    ): Promise<ResponsefindSubscriptionByIdRepository | null> {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id, deletedAt: null },
            include: {
                package: true,
            },
        });

        if (!subscription) return null;

        return {
            id: subscription.id,
            packageId: subscription.package.id,
            cycle: subscription.cycle,
            status: subscription.status,
            externalRefSubscriptionId: subscription.externalRefSubscriptionId,
            deletedAt: subscription.deletedAt,
            userId: subscription.userId,
        };
    }

    async updateSubscriptionBillingType(
        subscriptionId: string,
        billingType: BillingType,
    ): Promise<void> {
        await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: { billingType: billingType },
        });
    }

    async findOneSubscriptionByUserId(
        userId: string,
    ): Promise<SubscriptionProps | null> {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                status: "ACTIVE",
                deletedAt: null,
            },
            include: {
                package: {
                    select: {
                        id: true,
                        processLimit: true,
                        isMain: true,
                    },
                },
            },
        });

        if (!subscription) {
            return null;
        }

        return subscription;
    }
}
