import { PackageRepository } from "@/infra/prisma/repositories/interfaces/package.repository";
import { Injectable } from "@nestjs/common";
import {
    SoftDeletePackageErrors,
    SoftDeletePackageParams,
    SoftDeletePackageResponse,
    SoftDeletePackageUseCase,
} from "../use-cases/soft-delete-package.use-case";

@Injectable()
export class SoftDeletePackageService implements SoftDeletePackageUseCase {
    constructor(private readonly packageRepository: PackageRepository) {}

    async execute({
        packageId,
    }: SoftDeletePackageParams): Promise<
        | { status: "success"; data: SoftDeletePackageResponse }
        | { status: "error"; error: SoftDeletePackageErrors }
    > {
        try {
            const packageExists =
                await this.packageRepository.findOne(packageId);

            if (!packageExists) {
                return {
                    status: "error",
                    error: "Pacote não encontrado",
                };
            }

            await this.packageRepository.softDelete(packageId);

            return {
                status: "success",
                data: {
                    message: "Pacote deletado com sucesso",
                },
            };
        } catch (error) {
            console.error("Error deleting package:", error);
            return {
                status: "error",
                error: "Erro ao deletar pacote",
            };
        }
    }
}
