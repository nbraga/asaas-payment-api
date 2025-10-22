import { EnvModule } from "@/infra/env/env.module";
import { Module } from "@nestjs/common";
import { AsaasPaymentRepository } from "./repositories/asaas-payment.repository";
import { PaymentRepository } from "./repositories/interfaces/payment.repository";

@Module({
    imports: [EnvModule],
    providers: [
        {
            provide: PaymentRepository,
            useClass: AsaasPaymentRepository,
        },
    ],
    exports: [PaymentRepository],
})
export class AsaasModule {}
