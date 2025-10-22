import { IsPublic } from "@/common/decorators/public.decorator";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import { EnvService } from "@/infra/env/env.service";
import {
    Body,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    UnauthorizedException,
} from "@nestjs/common";
import {
    ApiHeader,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import {
    type WebhookEventDto,
    webhookEventSchema,
} from "../dto/webhook-event.dto";
import { ProcessWebhookService } from "../services/process-webhook.service";

@ApiTags("Webhooks")
@Controller("webhooks")
@IsPublic()
export class WebhookController {
    constructor(
        private readonly processWebhookService: ProcessWebhookService,
        private readonly envService: EnvService,
    ) {}

    @Post("asaas")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Webhook do Asaas",
        description:
            "Endpoint para receber eventos de webhook do Asaas (pagamentos recebidos, confirmados, etc.)",
    })
    @ApiHeader({
        name: "asaas-access-token",
        description: "Token de autenticação do webhook Asaas",
        required: true,
    })
    @ApiOkResponse({
        description: "Webhook recebido e processado com sucesso",
        schema: {
            example: {
                received: true,
            },
        },
    })
    async handle(
        @Headers("asaas-access-token") token: string,
        @Body(new ZodValidationPipe(webhookEventSchema))
        webhookEvent: WebhookEventDto,
    ) {
        const webhookToken = this.envService.get("ASAAS_WEBHOOK_TOKEN");

        if (webhookToken && token !== webhookToken) {
            throw new UnauthorizedException("Invalid webhook token");
        }

        await this.processWebhookService.execute(webhookEvent);

        return { received: true };
    }
}
