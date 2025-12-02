import { PackageRepository } from "@/infra/prisma/repositories/interfaces/package.repository";
import { SubscriptionRepository } from "@/infra/prisma/repositories/interfaces/subscription.repository";
import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import { PrismaPackageRepository } from "@/infra/prisma/repositories/prisma-package.repository";
import { PrismaSubscriptionRepository } from "@/infra/prisma/repositories/prisma-subscription.repository";
import { PrismaUserRepository } from "@/infra/prisma/repositories/prisma-user.repository";
import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Module({
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        {
            provide: PackageRepository,
            useClass: PrismaPackageRepository,
        },
        {
            provide: SubscriptionRepository,
            useClass: PrismaSubscriptionRepository,
        },
    ],
    exports: [
        PrismaService,
        UserRepository,
        PackageRepository,
        SubscriptionRepository,
    ],
})
export class PrismaModule {}
