import { Roles } from "@/common/decorators/roles.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import {
    ConflictException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Param,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import { FindOnePackageResponseDto } from "../dto/find-one-package.dto";
import { FindOnePackageService } from "../services/find-one-package.service";

@ApiTags("Pacotes")
@Controller("package")
@UseGuards(AuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "ADMIN")
export class FindOnePackageController {
    constructor(
        private readonly findOnePackageService: FindOnePackageService,
    ) {}

    @Get(":packageId")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Buscar pacote por ID",
        description:
            "Retorna os detalhes completos de um pacote específico. Acessível por SUPER_ADMIN, ADMIN e PURCHASER.",
    })
    @ApiParam({
        name: "packageId",
        description: "ID do pacote",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiOkResponse({
        description: "Pacote encontrado com sucesso",
        type: FindOnePackageResponseDto,
    })
    @ApiNotFoundResponse({
        description: "Pacote não encontrado",
        schema: {
            example: {
                message: "Pacote não encontrado",
                error: "Not Found",
                statusCode: 404,
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: "Erro interno do servidor",
        schema: {
            example: {
                message: "Erro ao buscar pacote",
                error: "Internal Server Error",
                statusCode: 500,
            },
        },
    })
    async findOnePackage(@Param("packageId") packageId: string) {
        const response = await this.findOnePackageService.execute({
            packageId,
        });

        if (response.status === "success") {
            return response.data;
        }

        switch (response.error) {
            case "Pacote não encontrado":
                throw new ConflictException({
                    message: response.error,
                });

            default:
                throw new InternalServerErrorException({
                    message: "Erro interno do servidor",
                });
        }
    }
}
