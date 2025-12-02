import { PackageProps } from "@/common/interfaces/package-props";
import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface FindManyPackagesParams {
    page?: number;
    limit?: number;
    order?: "asc" | "desc";
}

export type FindManyPackagesResponse = {
    packages: Pick<
        PackageProps,
        | "id"
        | "name"
        | "price"
        | "isMain"
        | "processLimit"
        | "isActive"
        | "createdAt"
    >[];
    totalPages: number;
    totalItems: number;
};

export type FindManyPackagesErrors = "Erro ao buscar pacotes";

export type FindManyPackagesUseCase = ServiceResponseProps<
    FindManyPackagesParams,
    FindManyPackagesErrors,
    FindManyPackagesResponse
>;
