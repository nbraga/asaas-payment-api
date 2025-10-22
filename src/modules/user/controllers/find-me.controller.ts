import { AuthGuard } from "@/common/guards/auth.guard";
import { type UserPayloadProps } from "@/common/interfaces/user-payload-props";
import { UserPayloadParam } from "@/common/param/user-payload.param";
import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Query,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { FindMeService } from "../services/find-me.service";

@ApiTags("Usuários")
@Controller("user/me")
@UseGuards(AuthGuard)
export class FindMeController {
    constructor(private readonly findMeService: FindMeService) {}

    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Obter informações do usuário autenticado",
        description:
            "Retorna todas as informações do usuário autenticado, incluindo empresas e papéis associados",
    })
    @ApiOkResponse({
        description: "Informações completas do usuário retornadas com sucesso",
        schema: {
            example: {
                message:
                    "Informações completas do usuário retornadas com sucesso",
                user: {
                    id: "uuid",
                    email: "usuario@exemplo.com",
                    fullName: "João da Silva",
                    phone: "(11) 98765-4321",
                    sector: "Tecnologia",
                    status: "ACTIVE",
                    companies: [
                        {
                            id: "uuid",
                            tradeName: "Empresa Exemplo",
                            socialName: "Empresa Exemplo LTDA",
                            cnpj: "12.345.678/0001-90",
                            roles: ["ADMIN", "USER"],
                        },
                    ],
                },
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: "Erro interno do servidor",
        schema: {
            example: {
                message: "Erro interno do servidor",
            },
        },
    })
    async findMe(
        @UserPayloadParam() user: UserPayloadProps,
        @Query("companyId") companyId: string,
    ) {
        const result = await this.findMeService.execute({
            userId: user.id,
            companyId,
        });

        if (result.status === "success") {
            return {
                message:
                    "Informações completas do usuário retornadas com sucesso",
                user: result.data,
            };
        }

        switch (result.error) {
            case "Usuário não encontrado":
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
