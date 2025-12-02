import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface CreatePackageParams {
  name: string;
  type: "BRONZE" | "SILVER" | "GOLD";
  processLimit?: number | null;
  price: string;
  isMain: boolean;
  features: { description: string }[];
}

export type CreatePackageResponse = null;

export type CreatePackageErrors =
  | "Pacote com esse nome já existe"
  | "Erro ao criar pacote"
  | "Já existe um pacote principal cadastrado"
  | "Número máximo de pacotes ativos atingido"
  | "Já existe um pacote ativo deste tipo cadastrado";

export type CreatePackageUseCase = ServiceResponseProps<
  CreatePackageParams,
  CreatePackageErrors,
  CreatePackageResponse
>;
