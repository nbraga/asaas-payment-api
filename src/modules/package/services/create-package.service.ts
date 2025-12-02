import { PackageRepository } from "@/infra/prisma/repositories/interfaces/package.repository";
import { Injectable } from "@nestjs/common";
import {
    CreatePackageErrors,
    CreatePackageParams,
    CreatePackageResponse,
    CreatePackageUseCase,
} from "../use-cases/create-package.use-case";

@Injectable()
export class CreatePackageService implements CreatePackageUseCase {
    constructor(private readonly packageRepository: PackageRepository) {}

    async execute(
        packageData: CreatePackageParams,
    ): Promise<
        | { status: "success"; data: CreatePackageResponse }
        | { status: "error"; error: CreatePackageErrors }
    > {
        const result = await this.packageRepository.findMany({});

        if (
            result.packages.some(
                (pkg) => pkg.type === packageData.type && pkg.isActive,
            )
        ) {
            return {
                status: "error",
                error: "Já existe um pacote ativo deste tipo cadastrado",
            };
        }

        if (packageData.isMain) {
            if (result.packages.some((pkg) => pkg.isMain)) {
                return {
                    status: "error",
                    error: "Já existe um pacote principal cadastrado",
                };
            }
        }

        if (result.packages.filter((pkg) => pkg.isActive).length === 3) {
            return {
                status: "error",
                error: "Número máximo de pacotes ativos atingido",
            };
        }

        const packageFormated = {
            ...packageData,
            price: BigInt(packageData.price),
        };

        await this.packageRepository.create(packageFormated);

        return {
            status: "success",
            data: null,
        };
    }
}
