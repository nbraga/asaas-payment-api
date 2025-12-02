import { Roles } from "@/common/decorators/roles.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
    Body,
    ConflictException,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import {
    type CreatePackageDto,
    CreatePackageResponseDto,
    createPackageSchema,
    CreatePackageSwaggerDto,
} from "../dto/create-package.dto";
import { CreatePackageService } from "../services/create-package.service";

@ApiTags("Pacotes")
@Controller("package")
@UseGuards(AuthGuard, RolesGuard)
@Roles("SUPER_ADMIN")
export class CreatePackageController {
    constructor(private readonly createPackageService: CreatePackageService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Criar novo pacote",
        description:
            "Cria um novo pacote com limite de processos e funcionalidades. Apenas SUPER_ADMIN pode executar esta ação.",
    })
    @ApiBody({
        type: CreatePackageSwaggerDto,
        description: "Dados do pacote a ser criado",
    })
    @ApiCreatedResponse({
        description: "Pacote criado com sucesso",
        type: CreatePackageResponseDto,
    })
    @ApiConflictResponse({
        description: "Pacote com esse nome já existe",
        schema: {
            example: {
                message: "Pacote com esse nome já existe",
                error: "Conflict",
                statusCode: 409,
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: "Erro interno do servidor",
        schema: {
            example: {
                message: "Erro ao criar pacote",
                error: "Internal Server Error",
                statusCode: 500,
            },
        },
    })
    async createPackage(
        @Body(new ZodValidationPipe(createPackageSchema))
        body: CreatePackageDto,
    ) {
        const result = await this.createPackageService.execute(body);

        if (result.status === "success") {
            return {
                message: "Pacote criado com sucesso",
            };
        }

        switch (result.error) {
            case "Já existe um pacote principal cadastrado":
                throw new ConflictException({
                    message: result.error,
                });
            case "Número máximo de pacotes ativos atingido":
                throw new ConflictException({
                    message: result.error,
                });
            default:
                throw new InternalServerErrorException({
                    message: "Erro interno do servidor",
                });
        }
    }
}
