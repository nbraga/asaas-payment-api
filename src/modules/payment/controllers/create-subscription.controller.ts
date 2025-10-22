import { AuthGuard } from "@/common/guards/auth.guard";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
    createSubscriptionSchema,
    CreateSubscriptionSwaggerDto,
    type CreateSubscriptionDto,
} from "@/modules/payment/dto/create-subscription.dto";
import { CreateSubscriptionService } from "@/modules/payment/services/create-subscription.service";
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

@ApiTags("Assinaturas")
@ApiBearerAuth()
@Controller("subscriptions")
@UseGuards(AuthGuard)
export class CreateSubscriptionController {
    constructor(
        private readonly createSubscriptionService: CreateSubscriptionService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: "Criar nova assinatura",
        description:
            "Cria uma nova assinatura recorrente no Asaas. Se não informar customerId, um novo cliente será criado.",
    })
    @ApiBody({
        schema: {
            type: "object",
            required: ["billingType", "value", "nextDueDate", "cycle"],
            properties: CreateSubscriptionSwaggerDto(),
        },
        description: "Dados para criação da assinatura",
    })
    @ApiCreatedResponse({
        description: "Assinatura criada com sucesso",
        schema: {
            example: {
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
        },
    })
    @ApiBadRequestResponse({
        description: "Dados inválidos",
    })
    async handle(
        @Body(new ZodValidationPipe(createSubscriptionSchema))
        body: CreateSubscriptionDto,
    ) {
        return this.createSubscriptionService.execute(body);
    }
}
