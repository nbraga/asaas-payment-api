import { AuthGuard } from "@/common/guards/auth.guard";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
    createCustomerSchema,
    type CreateCustomerDto,
} from "@/modules/payment/dto/create-customer.dto";
import { CreateCustomerService } from "@/modules/payment/services/create-customer.service";
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";

@ApiTags("Clientes")
@ApiBearerAuth()
@Controller("customers")
@UseGuards(AuthGuard)
export class CreateCustomerController {
    constructor(
        private readonly createCustomerService: CreateCustomerService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: "Criar novo cliente",
        description:
            "Cria um novo cliente no Asaas. Este cliente poderá ser utilizado para criar cobranças posteriormente.",
    })
    @ApiBody({
        schema: {
            type: "object",
            required: ["name", "cpfCnpj"],
            properties: {
                name: {
                    type: "string",
                    description: "Nome completo do cliente",
                    example: "João da Silva",
                    minLength: 1,
                    maxLength: 100,
                },
                cpfCnpj: {
                    type: "string",
                    description: "CPF ou CNPJ do cliente (apenas números)",
                    example: "12345678901",
                    minLength: 11,
                    maxLength: 14,
                },
                email: {
                    type: "string",
                    format: "email",
                    description: "Email do cliente (opcional)",
                    example: "joao@exemplo.com",
                },
                phone: {
                    type: "string",
                    description: "Telefone do cliente (opcional)",
                    example: "11987654321",
                    minLength: 8,
                    maxLength: 15,
                },
            },
        },
        description: "Dados para criação do cliente",
    })
    @ApiCreatedResponse({
        description: "Cliente criado com sucesso",
        schema: {
            example: {
                id: "cus_000001234567",
                name: "João da Silva",
                cpfCnpj: "12345678901",
                email: "joao@exemplo.com",
                phone: "11987654321",
                mobilePhone: "11987654321",
                dateCreated: "2025-10-21",
            },
        },
    })
    @ApiBadRequestResponse({
        description: "Dados inválidos ou CPF/CNPJ já cadastrado",
    })
    async handle(
        @Body(new ZodValidationPipe(createCustomerSchema))
        body: CreateCustomerDto,
    ) {
        return this.createCustomerService.execute(body);
    }
}
