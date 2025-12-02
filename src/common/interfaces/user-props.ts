import type { RoleType, UserStatusType } from "generated/prisma";

export interface UserProps {
    id: string;
    email: string;
    fullName: string;
    cnpj: string;
    role: RoleType;
    password: string;
    phone: string;
    status: UserStatusType;
    createdAt: Date;
}
