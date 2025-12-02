import {
    BillingType,
    CycleType,
    SubscriptionStatusType,
} from "generated/prisma";

export interface SubscriptionProps {
    id: string;
    userId: string;
    deletedAt: Date | null;
    cycle: CycleType;
    status: SubscriptionStatusType;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    package: {
        id: string;
        processLimit: number | null;
        isMain: boolean;
    };
    externalRefSubscriptionId: string | null;
    nextDueDate: Date | null;
}

export type ParamsCreateSubscriptionRepository = {
    userId: string;
    packageId: string;
    cycle: CycleType;
    status: SubscriptionStatusType;
    endDate?: Date;
    externalRefSubscriptionId?: string;
    billingType: BillingType;
    last4CardDigits?: string;
};

export type ParamsUpdateSubscriptionRepository = {
    subscriptionId: string;
    status?: SubscriptionStatusType;
    endDate?: Date;
    userId?: string;
    packageId?: string;
    cycle?: CycleType;
    externalRefSubscriptionId?: string;
    last4CardDigits?: string | null;
    nextDueDate?: Date;
};

export type ResponsefindSubscriptionByIdRepository = {
    id: string;
    userId: string;
    packageId: string;
    cycle: CycleType;
    status: SubscriptionStatusType;
    externalRefSubscriptionId: string | null;
    deletedAt: Date | null;
};

export abstract class SubscriptionRepository {
    abstract createSubscription(
        params: ParamsCreateSubscriptionRepository,
    ): Promise<Omit<SubscriptionProps, "package">>;

    abstract updateSubscription(
        params: ParamsUpdateSubscriptionRepository,
    ): Promise<Omit<SubscriptionProps, "package">>;

    abstract softDeleteSubscription(id: string): Promise<void>;
    abstract hardDeleteSubscription(id: string): Promise<void>;

    abstract subscriptionExists(
        companyId: string,
        packageId: string,
        cycle: CycleType,
    ): Promise<Omit<SubscriptionProps, "package"> | null>;

    abstract findSubscriptionById(
        id: string,
    ): Promise<ResponsefindSubscriptionByIdRepository | null>;

    abstract findOneSubscriptionByUserId(
        userId: string,
    ): Promise<SubscriptionProps | null>;
}
