import { AuthGuard } from "@/common/guards/auth.guard";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
    listSubscriptionsSchema,
    type ListSubscriptionsDto,
} from "@/modules/payment/dto/list-subscriptions.dto";
import { ListSubscriptionsService } from "@/modules/payment/services/list-subscriptions.service";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from "@nestjs/swagger";

@ApiTags("Assinaturas")
@ApiBearerAuth()
@Controller("subscriptions")
@UseGuards(AuthGuard)
export class ListSubscriptionsController {
    constructor(
        private readonly listSubscriptionsService: ListSubscriptionsService,
    ) {}

    @Get()
    @ApiOperation({
        summary: "Listar assinaturas",
        description:
            "Lista todas as assinaturas com opções de filtro e paginação",
    })
    @ApiQuery({
        name: "customer",
        required: false,
        type: String,
        description: "ID do cliente",
        example: "cus_000001234567",
    })
    @ApiQuery({
        name: "status",
        required: false,
        enum: ["ACTIVE", "EXPIRED", "OVERDUE", "INACTIVE"],
        description: "Status da assinatura",
        example: "ACTIVE",
    })
    @ApiQuery({
        name: "offset",
        required: false,
        type: Number,
        description: "Número de registros para pular",
        example: 0,
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        description: "Número máximo de registros por página",
        example: 10,
    })
    @ApiOkResponse({
        description: "Lista de assinaturas retornada com sucesso",
        schema: {
            example: {
                data: [
                    {
                        id: "sub_123456789",
                        customer: "cus_000001234567",
                        billingType: "CREDIT_CARD",
                        value: 49.9,
                        nextDueDate: "2025-11-01",
                        cycle: "MONTHLY",
                        description: "Plano Premium Mensal",
                        status: "ACTIVE",
                        dateCreated: "2025-10-22",
                    },
                ],
                totalCount: 1,
                hasMore: false,
            },
        },
    })
    async handle(
        @Query(new ZodValidationPipe(listSubscriptionsSchema))
        query: ListSubscriptionsDto,
    ) {
        return this.listSubscriptionsService.execute(query);
    }
}
