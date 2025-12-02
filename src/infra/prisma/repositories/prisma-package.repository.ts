import type { PackageProps } from "@/common/interfaces/package-props";
import type { PaginationProps } from "@/common/interfaces/pagination-props";
import { PrismaService } from "@/infra/prisma/prisma.service";
import {
    PackageRepository,
    ParamsCreatePackageRepositoryProps,
    ResponseFindManyPackagesRepository,
} from "@/infra/prisma/repositories/interfaces/package.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaPackageRepository implements PackageRepository {
    constructor(private prisma: PrismaService) {}

    async create(
        packageData: ParamsCreatePackageRepositoryProps,
    ): Promise<void> {
        await this.prisma.package.create({
            data: {
                name: packageData.name,
                type: packageData.type,
                processLimit: packageData.processLimit || null,
                price: packageData.price,
                isMain: packageData.isMain,
                order:
                    packageData.type === "BRONZE"
                        ? 1
                        : packageData.type === "SILVER"
                          ? 2
                          : 3,
            },
        });
    }

    async findMany({
        page = 1,
        limit = 10,
        order = "asc",
    }: PaginationProps): Promise<ResponseFindManyPackagesRepository> {
        const packages = await this.prisma.package.findMany({
            where: {
                deletedAt: null,
                isActive: true,
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: {
                name: order as "asc" | "desc",
            },
        });

        return {
            packages: packages.map((pkg) => ({
                id: pkg.id,
                name: pkg.name,
                type: pkg.type,
                processLimit: pkg.processLimit ?? null,
                price: Number(pkg.price),
                isMain: pkg.isMain,
                isActive: pkg.isActive,
                createdAt: pkg.createdAt,
                deletedAt: pkg.deletedAt,
                order: pkg.order,
            })),
            totalPages: Math.ceil((await this.count()) / limit),
            totalItems: await this.count(),
        };
    }

    async count(): Promise<number> {
        return await this.prisma.package.count({
            where: {
                deletedAt: null,
                isActive: true,
            },
        });
    }

    async findOne(packageId: string): Promise<PackageProps | null> {
        const foundPackage = await this.prisma.package.findUnique({
            where: {
                id: packageId,
                deletedAt: null,
            },
        });

        if (!foundPackage) {
            return null;
        }

        return {
            ...foundPackage,
            price: Number(foundPackage.price),
        };
    }

    async softDelete(packageId: string): Promise<void> {
        await this.prisma.package.update({
            where: {
                id: packageId,
            },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }

    async toggleActive(packageId: string, isActive: boolean): Promise<void> {
        await this.prisma.package.update({
            where: {
                id: packageId,
            },
            data: {
                isActive: isActive,
            },
        });
    }
}
