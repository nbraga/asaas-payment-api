import { AsaasModule } from "@/infra/asaas/asaas.module";
import { EnvModule } from "@/infra/env/env.module";
import { PrismaModule } from "@/infra/prisma/prisma.module";
import { CreateCustomerController } from "@/modules/payment/controllers/create-customer.controller";
import { CreateCustomerService } from "@/modules/payment/services/create-customer.service";
import { Module } from "@nestjs/common";
import { CreatePaymentController } from "./controllers/create-payment.controller";
import { CreateSubscriptionController } from "./controllers/create-subscription.controller";
import { GetPaymentController } from "./controllers/get-payment.controller";
import { ListCustomersController } from "./controllers/list-customers.controller";
import { ListSubscriptionsController } from "./controllers/list-subscriptions.controller";
import { WebhookController } from "./controllers/webhook.controller";
import { CreatePaymentService } from "./services/create-payment.service";
import { CreateSubscriptionService } from "./services/create-subscription.service";
import { GetPaymentService } from "./services/get-payment.service";
import { ListCustomersService } from "./services/list-customers.service";
import { ListSubscriptionsService } from "./services/list-subscriptions.service";
import { ProcessWebhookService } from "./services/process-webhook.service";

@Module({
    imports: [AsaasModule, EnvModule, PrismaModule],
    controllers: [
        CreateCustomerController,
        CreatePaymentController,
        CreateSubscriptionController,
        GetPaymentController,
        ListCustomersController,
        ListSubscriptionsController,
        WebhookController,
    ],
    providers: [
        CreateCustomerService,
        CreatePaymentService,
        CreateSubscriptionService,
        GetPaymentService,
        ListCustomersService,
        ListSubscriptionsService,
        ProcessWebhookService,
    ],
})
export class PaymentModule {}
