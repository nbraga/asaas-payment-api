import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface FindOnePackageParams {
    packageId: string;
}

export type FindOnePackageResponse = {
    id: string;
    name: string;
    processLimit: number | null;
    price: number;
    isMain: boolean;
    isActive: boolean;
    createdAt: Date;
};

export type FindOnePackageErrors =
    | "Pacote não encontrado"
    | "Erro ao buscar pacote";

export type FindOnePackageUseCase = ServiceResponseProps<
    FindOnePackageParams,
    FindOnePackageErrors,
    FindOnePackageResponse
>;
