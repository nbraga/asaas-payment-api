import { z } from "zod";

export const createSubscriptionSchema = z
    .object({
        packageId: z.uuid({
            message: "packageId deve ser um UUID válido",
        }),
        billingType: z
            .enum(["BOLETO", "CREDIT_CARD", "PIX"])
            .describe("Tipo de cobrança"),
        cycle: z
            .enum(["MONTHLY", "SEMIANNUALLY", "YEARLY"])
            .describe("Ciclo de cobrança"),
        creditCard: z
            .object({
                holderName: z.string().min(3),
                number: z
                    .string()
                    .transform((val) => val.replace(/\s/g, ""))
                    .pipe(z.string().regex(/^\d{13,16}$/)),
                expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/),
                expiryYear: z.string().regex(/^\d{4}$/),
                ccv: z.string().regex(/^\d{3,4}$/),
            })
            .optional(),
        creditCardHolderInfo: z
            .object({
                postalCode: z.string().regex(/^\d{8}$/),
                addressNumber: z.string(),
                addressComplement: z.string().optional(),
            })
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.billingType === "CREDIT_CARD") {
            if (!data.creditCard) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        "Dados do cartão de crédito são obrigatórios quando billingType é CREDIT_CARD",
                    path: ["creditCard"],
                });
            }
            if (!data.creditCardHolderInfo) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        "Dados do titular do cartão são obrigatórios quando billingType é CREDIT_CARD",
                    path: ["creditCardHolderInfo"],
                });
            }
        }
    });

export type CreateSubscriptionDto = z.infer<typeof createSubscriptionSchema>;

export function CreateSubscriptionSwaggerDto() {
    return {
        customerId: {
            type: "string",
            description: "ID do cliente existente (opcional)",
            example: "cus_000001234567",
        },
        customerName: {
            type: "string",
            description: "Nome completo do cliente",
            example: "João da Silva",
        },
        customerCpfCnpj: {
            type: "string",
            description: "CPF ou CNPJ do cliente",
            example: "12345678901",
        },
        customerEmail: {
            type: "string",
            format: "email",
            description: "Email do cliente",
            example: "joao@exemplo.com",
        },
        customerPhone: {
            type: "string",
            description: "Telefone do cliente",
            example: "11987654321",
        },
        billingType: {
            type: "string",
            enum: ["BOLETO", "CREDIT_CARD", "PIX", "UNDEFINED"],
            description: "Tipo de cobrança",
            example: "CREDIT_CARD",
        },
        value: {
            type: "number",
            description: "Valor da assinatura",
            example: 49.9,
        },
        nextDueDate: {
            type: "string",
            format: "date",
            description: "Data do primeiro vencimento (YYYY-MM-DD)",
            example: "2025-11-01",
        },
        cycle: {
            type: "string",
            enum: [
                "WEEKLY",
                "BIWEEKLY",
                "MONTHLY",
                "QUARTERLY",
                "SEMIANNUALLY",
                "YEARLY",
            ],
            description: "Ciclo de cobrança",
            example: "MONTHLY",
        },
        description: {
            type: "string",
            description: "Descrição da assinatura",
            example: "Plano Premium Mensal",
        },
        externalReference: {
            type: "string",
            description: "Referência externa",
            example: "SUB-12345",
        },
        endDate: {
            type: "string",
            format: "date",
            description: "Data de término (YYYY-MM-DD)",
            example: "2026-11-01",
        },
        maxPayments: {
            type: "number",
            description: "Número máximo de cobranças",
            example: 12,
        },
    };
}
