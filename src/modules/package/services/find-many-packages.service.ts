import { PackageRepository } from "@/infra/prisma/repositories/interfaces/package.repository";
import { Injectable } from "@nestjs/common";
import {
    FindManyPackagesErrors,
    FindManyPackagesParams,
    FindManyPackagesResponse,
    FindManyPackagesUseCase,
} from "../use-cases/find-many-packages.use-case";

@Injectable()
export class FindManyPackagesService implements FindManyPackagesUseCase {
    constructor(private readonly packageRepository: PackageRepository) {}

    async execute({
        page = 1,
        limit = 10,
        order = "asc",
    }: FindManyPackagesParams): Promise<
        | { status: "success"; data: FindManyPackagesResponse }
        | { status: "error"; error: FindManyPackagesErrors }
    > {
        const result = await this.packageRepository.findMany({
            page,
            limit,
            order,
        });

        return {
            status: "success",
            data: { ...result },
        };
    }
}
