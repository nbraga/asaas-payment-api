import { AuthGuard } from "@/common/guards/auth.guard";
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import { GetPaymentService } from "../services/get-payment.service";

@ApiTags("Pagamentos")
@ApiBearerAuth()
@Controller("payments")
@UseGuards(AuthGuard)
export class GetPaymentController {
    constructor(private readonly getPaymentService: GetPaymentService) {}

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Buscar cobrança por ID",
        description: "Retorna os detalhes de uma cobrança específica do Asaas",
    })
    @ApiParam({
        name: "id",
        description: "ID da cobrança",
        example: "pay_123456789",
    })
    @ApiOkResponse({
        description: "Cobrança encontrada",
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
                dateCreated: "2025-10-20",
            },
        },
    })
    @ApiNotFoundResponse({
        description: "Cobrança não encontrada",
    })
    async handle(@Param("id") id: string) {
        return this.getPaymentService.execute(id);
    }
}
