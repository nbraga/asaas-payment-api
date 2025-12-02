import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface CreateUserParams {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    cnpj: string;
    role: "ADMIN" | "CLIENT";
}

export type CreateUserResponse = {
    token: string;
};

export type CreateUserErrors =
    | "Email já está em uso"
    | "CNPJ já está em uso"
    | "Empresa não encontrada";

export type CreateUserUseCase = ServiceResponseProps<
    CreateUserParams,
    CreateUserErrors,
    CreateUserResponse
>;
