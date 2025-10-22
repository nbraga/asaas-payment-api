import { Injectable, Logger } from "@nestjs/common";
import type { WebhookEventDto } from "../dto/webhook-event.dto";

@Injectable()
export class ProcessWebhookService {
    private readonly logger = new Logger(ProcessWebhookService.name);

    async execute(event: WebhookEventDto): Promise<void> {
        this.logger.log(`Processing webhook event: ${event.event}`);

        switch (event.event) {
            case "PAYMENT_RECEIVED":
                await this.handlePaymentReceived(event);
                break;
            case "PAYMENT_CONFIRMED":
                await this.handlePaymentConfirmed(event);
                break;
            case "PAYMENT_OVERDUE":
                await this.handlePaymentOverdue(event);
                break;
            case "PAYMENT_DELETED":
                await this.handlePaymentDeleted(event);
                break;
            case "PAYMENT_RESTORED":
                await this.handlePaymentRestored(event);
                break;
            case "PAYMENT_REFUNDED":
                await this.handlePaymentRefunded(event);
                break;
            default:
                this.logger.warn(`Unhandled event type: ${event.event}`);
        }
    }

    private async handlePaymentReceived(event: WebhookEventDto): Promise<void> {
        this.logger.log(`Payment received: ${event.payment.id}`);
        // TODO: Implementar lógica de pagamento recebido
        // Ex: Atualizar status no banco, enviar email, liberar acesso, etc.
    }

    private async handlePaymentConfirmed(
        event: WebhookEventDto,
    ): Promise<void> {
        this.logger.log(`Payment confirmed: ${event.payment.id}`);
        // TODO: Implementar lógica de pagamento confirmado
    }

    private async handlePaymentOverdue(event: WebhookEventDto): Promise<void> {
        this.logger.log(`Payment overdue: ${event.payment.id}`);
        // TODO: Implementar lógica de pagamento atrasado
        // Ex: Enviar email de lembrete, bloquear acesso, etc.
    }

    private async handlePaymentDeleted(event: WebhookEventDto): Promise<void> {
        this.logger.log(`Payment deleted: ${event.payment.id}`);
        // TODO: Implementar lógica de pagamento deletado
    }

    private async handlePaymentRestored(event: WebhookEventDto): Promise<void> {
        this.logger.log(`Payment restored: ${event.payment.id}`);
        // TODO: Implementar lógica de pagamento restaurado
    }

    private async handlePaymentRefunded(event: WebhookEventDto): Promise<void> {
        this.logger.log(`Payment refunded: ${event.payment.id}`);
        // TODO: Implementar lógica de pagamento estornado
    }
}
