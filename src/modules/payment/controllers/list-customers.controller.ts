import { AuthGuard } from "@/common/guards/auth.guard";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from "@nestjs/swagger";
import {
    type ListCustomersDto,
    listCustomersSchema,
} from "../dto/list-customers.dto";
import { ListCustomersService } from "../services/list-customers.service";

@ApiTags("Clientes")
@ApiBearerAuth()
@Controller("customers")
@UseGuards(AuthGuard)
export class ListCustomersController {
    constructor(private readonly listCustomersService: ListCustomersService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Listar clientes",
        description:
            "Lista todos os clientes cadastrados no Asaas com filtros opcionais",
    })
    @ApiQuery({
        name: "name",
        required: false,
        description: "Filtrar por nome do cliente",
        type: String,
    })
    @ApiQuery({
        name: "email",
        required: false,
        description: "Filtrar por email do cliente",
        type: String,
    })
    @ApiQuery({
        name: "cpfCnpj",
        required: false,
        description: "Filtrar por CPF/CNPJ do cliente",
        type: String,
    })
    @ApiQuery({
        name: "offset",
        required: false,
        description: "Offset para paginação",
        type: Number,
        example: 0,
    })
    @ApiQuery({
        name: "limit",
        required: false,
        description: "Limite de registros por página",
        type: Number,
        example: 10,
    })
    @ApiOkResponse({
        description: "Lista de clientes retornada com sucesso",
        schema: {
            example: {
                data: [
                    {
                        id: "cus_000001234567",
                        name: "João da Silva",
                        email: "joao@exemplo.com",
                        cpfCnpj: "12345678901",
                        phone: "11987654321",
                        mobilePhone: "11987654321",
                        address: "Rua Exemplo",
                        addressNumber: "123",
                        province: "São Paulo",
                        postalCode: "01234567",
                    },
                ],
                totalCount: 1,
                hasMore: false,
            },
        },
    })
    async handle(
        @Query(new ZodValidationPipe(listCustomersSchema))
        query: ListCustomersDto,
    ) {
        return this.listCustomersService.execute(query);
    }
}
