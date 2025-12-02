import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface SoftDeletePackageParams {
  packageId: string;
}

export type SoftDeletePackageResponse = {
  message: string;
};

export type SoftDeletePackageErrors =
  | "Pacote não encontrado"
  | "Erro ao deletar pacote";

export type SoftDeletePackageUseCase = ServiceResponseProps<
  SoftDeletePackageParams,
  SoftDeletePackageErrors,
  SoftDeletePackageResponse
>;
