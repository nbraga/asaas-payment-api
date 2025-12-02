import { Roles } from "@/common/decorators/roles.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import {
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
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
import { SoftDeletePackageResponseDto } from "../dto/soft-delete-package.dto";
import { SoftDeletePackageService } from "../services/soft-delete-package.service";

@ApiTags("Pacotes")
@Controller("package")
@UseGuards(AuthGuard, RolesGuard)
@Roles("SUPER_ADMIN")
export class SoftDeletePackageController {
    constructor(
        private readonly softDeletePackageService: SoftDeletePackageService,
    ) {}

    @Delete(":packageId")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Deletar pacote (soft delete)",
        description:
            "Realiza a deleção lógica de um pacote. O pacote não será removido do banco, apenas marcado como deletado. Apenas SUPER_ADMIN pode executar esta ação.",
    })
    @ApiParam({
        name: "packageId",
        description: "ID do pacote a ser deletado",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiOkResponse({
        description: "Pacote deletado com sucesso",
        type: SoftDeletePackageResponseDto,
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
                message: "Erro ao deletar pacote",
                error: "Internal Server Error",
                statusCode: 500,
            },
        },
    })
    async softDeletePackage(
        @Param("packageId") packageId: string,
    ): Promise<SoftDeletePackageResponseDto> {
        const result = await this.softDeletePackageService.execute({
            packageId,
        });

        if (result.status === "error") {
            if (result.error === "Pacote não encontrado") {
                throw new NotFoundException(result.error);
            }
            throw new InternalServerErrorException(result.error);
        }

        return result.data;
    }
}
