import type { PackageProps } from "@/common/interfaces/package-props";
import type { PaginationProps } from "@/common/interfaces/pagination-props";

export interface ParamsCreatePackageRepositoryProps {
    name: string;
    type: "BRONZE" | "SILVER" | "GOLD";
    processLimit?: number | null;
    price: bigint;
    isMain: boolean;
}

export interface ResponseFindManyPackagesRepository {
    packages: PackageProps[];
    totalPages: number;
    totalItems: number;
}

export abstract class PackageRepository {
    abstract create(params: ParamsCreatePackageRepositoryProps): Promise<void>;

    abstract findMany(
        params: PaginationProps,
    ): Promise<ResponseFindManyPackagesRepository>;

    abstract count(): Promise<number>;

    abstract findOne(packageId: string): Promise<PackageProps | null>;

    abstract softDelete(packageId: string): Promise<void>;

    abstract toggleActive(packageId: string, isActive: boolean): Promise<void>;
}
