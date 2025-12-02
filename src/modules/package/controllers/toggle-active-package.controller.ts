import { Roles } from "@/common/decorators/roles.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import {
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
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
import { ToggleActivePackageService } from "../services/toggle-active-package.service";

@ApiTags("Pacotes")
@Controller("package")
@UseGuards(AuthGuard, RolesGuard)
@Roles("SUPER_ADMIN")
export class ToggleActivePackageController {
    constructor(
        private readonly toggleActivePackageService: ToggleActivePackageService,
    ) {}

    @Patch(":packageId/toggle-active")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Ativar/Desativar pacote",
        description:
            "Alterna o status ativo/inativo de um pacote específico. Se o pacote estiver ativo, será desativado e vice-versa. Apenas SUPER_ADMIN pode executar esta ação.",
    })
    @ApiParam({
        name: "packageId",
        description: "ID do pacote a ser ativado/desativado",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiOkResponse({
        description: "Status do pacote alterado com sucesso",
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
                message: "Erro ao alterar status do pacote",
                error: "Internal Server Error",
                statusCode: 500,
            },
        },
    })
    async toggleActivePackage(
        @Param("packageId") packageId: string,
    ): Promise<void> {
        const result = await this.toggleActivePackageService.execute({
            packageId,
        });

        if (result.status === "error") {
            if (result.error === "Pacote não encontrado") {
                throw new NotFoundException(result.error);
            }
            throw new InternalServerErrorException(result.error);
        }
    }
}
