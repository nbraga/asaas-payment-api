import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export type ToggleActivePackageParams = {
  packageId: string;
};

export type ToggleActivePackageResponse = null;

export type ToggleActivePackageErrors = "Pacote não encontrado";

export type ToggleActivePackageUseCase = ServiceResponseProps<
  ToggleActivePackageParams,
  ToggleActivePackageErrors,
  ToggleActivePackageResponse
>;
