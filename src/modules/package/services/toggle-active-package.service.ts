import { PackageRepository } from "@/infra/prisma/repositories/interfaces/package.repository";
import { Injectable } from "@nestjs/common";
import {
    ToggleActivePackageErrors,
    ToggleActivePackageParams,
    ToggleActivePackageResponse,
    ToggleActivePackageUseCase,
} from "../use-cases/toggle-active-package.use-case";

@Injectable()
export class ToggleActivePackageService implements ToggleActivePackageUseCase {
    constructor(private readonly packageRepository: PackageRepository) {}

    async execute(
        params: ToggleActivePackageParams,
    ): Promise<
        | { status: "success"; data: ToggleActivePackageResponse }
        | { status: "error"; error: ToggleActivePackageErrors }
    > {
        const packageExists = await this.packageRepository.findOne(
            params.packageId,
        );

        if (!packageExists) {
            return {
                status: "error",
                error: "Pacote não encontrado",
            };
        }

        await this.packageRepository.toggleActive(
            params.packageId,
            !packageExists.isActive,
        );

        return {
            status: "success",
            data: null,
        };
    }
}
