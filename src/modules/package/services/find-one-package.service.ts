import { PackageRepository } from "@/infra/prisma/repositories/interfaces/package.repository";
import { Injectable } from "@nestjs/common";
import {
    FindOnePackageErrors,
    FindOnePackageParams,
    FindOnePackageResponse,
    FindOnePackageUseCase,
} from "../use-cases/find-one-package.use-case";

@Injectable()
export class FindOnePackageService implements FindOnePackageUseCase {
    constructor(private readonly packageRepository: PackageRepository) {}

    async execute({
        packageId,
    }: FindOnePackageParams): Promise<
        | { status: "success"; data: FindOnePackageResponse }
        | { status: "error"; error: FindOnePackageErrors }
    > {
        const packageData = await this.packageRepository.findOne(packageId);

        if (!packageData) {
            return {
                status: "error",
                error: "Pacote não encontrado",
            };
        }

        return {
            status: "success",
            data: packageData,
        };
    }
}
