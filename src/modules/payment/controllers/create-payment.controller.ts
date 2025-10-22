import { AuthGuard } from "@/common/guards/auth.guard";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
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
import {
    type CreatePaymentDto,
    createPaymentSchema,
    CreatePaymentSwaggerDto,
} from "../dto/create-payment.dto";
import { CreatePaymentService } from "../services/create-payment.service";

@ApiTags("Pagamentos")
@ApiBearerAuth()
@Controller("payments")
@UseGuards(AuthGuard)
export class CreatePaymentController {
    constructor(private readonly createPaymentService: CreatePaymentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: "Criar nova cobrança",
        description:
            "Cria uma nova cobrança no Asaas. Pode ser boleto, PIX ou cartão de crédito.",
    })
    @ApiBody({
        schema: {
            type: "object",
            properties: CreatePaymentSwaggerDto(),
        },
        description: "Dados para criação da cobrança",
    })
    @ApiCreatedResponse({
        description: "Cobrança criada com sucesso",
        schema: {
            example: {
                id: "pay_123456789",
                customer: "cus_000001234567",
                billingType: "PIX",
                value: 100.0,
                netValue: 99.0,
                dueDate: "2025-10-25",
                status: "PENDING",
                description: "Pagamento de teste",
                invoiceUrl: "https://...",
                pixCopyAndPaste: "00020126580014br.gov.bcb.pix...",
                dateCreated: "2025-10-20",
            },
        },
    })
    @ApiBadRequestResponse({
        description: "Dados inválidos",
    })
    async handle(
        @Body(new ZodValidationPipe(createPaymentSchema))
        createPaymentDto: CreatePaymentDto,
    ) {
        return this.createPaymentService.execute(createPaymentDto);
    }
}
