import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Query,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from "@nestjs/swagger";
import {
    type FindManyPackagesDto,
    FindManyPackagesResponseDto,
    findManyPackagesSchema,
} from "../dto/find-many-packages.dto";

import { FindManyPackagesService } from "../services/find-many-packages.service";

@ApiTags("Pacotes")
@Controller("packages")
export class FindManyPackagesController {
    constructor(
        private readonly findManyPackagesService: FindManyPackagesService,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Listar pacotes",
        description:
            "Retorna uma lista paginada de pacotes disponíveis. Acessível por SUPER_ADMIN, ADMIN e PURCHASER.",
    })
    @ApiQuery({
        name: "page",
        required: false,
        type: Number,
        description: "Número da página",
        example: 1,
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        description: "Quantidade de itens por página",
        example: 10,
    })
    @ApiQuery({
        name: "order",
        required: false,
        enum: ["asc", "desc"],
        description: "Ordenação por nome",
        example: "asc",
    })
    @ApiOkResponse({
        description: "Lista de pacotes retornada com sucesso",
        type: FindManyPackagesResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: "Erro interno do servidor",
        schema: {
            example: {
                message: "Erro ao buscar pacotes",
                error: "Internal Server Error",
                statusCode: 500,
            },
        },
    })
    async findManyPackages(
        @Query(new ZodValidationPipe(findManyPackagesSchema))
        query: FindManyPackagesDto,
    ) {
        const result = await this.findManyPackagesService.execute(query);

        if (result.status === "success") {
            return result.data;
        }

        switch (result.error) {
            case "Erro ao buscar pacotes":
                throw new BadRequestException({
                    message: result.error,
                });
            default:
                throw new InternalServerErrorException({
                    message: "Erro interno do servidor",
                });
        }
    }
}
