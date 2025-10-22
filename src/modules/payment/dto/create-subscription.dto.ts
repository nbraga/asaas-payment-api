import { z } from "zod";

export const createSubscriptionSchema = z.object({
    customerId: z
        .string()
        .optional()
        .describe("ID do cliente existente (opcional)"),
    customerName: z.string().min(1).optional().describe("Nome do cliente"),
    customerCpfCnpj: z.string().min(11).max(14).optional().describe("CPF/CNPJ"),
    customerEmail: z.string().email().optional().describe("Email do cliente"),
    customerPhone: z.string().optional().describe("Telefone do cliente"),
    billingType: z
        .enum(["BOLETO", "CREDIT_CARD", "PIX", "UNDEFINED"])
        .describe("Tipo de cobrança"),
    value: z.number().positive().describe("Valor da assinatura"),
    nextDueDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Data do primeiro vencimento (YYYY-MM-DD)"),
    cycle: z
        .enum([
            "WEEKLY",
            "BIWEEKLY",
            "MONTHLY",
            "QUARTERLY",
            "SEMIANNUALLY",
            "YEARLY",
        ])
        .describe("Ciclo de cobrança"),
    description: z.string().optional().describe("Descrição da assinatura"),
    externalReference: z.string().optional().describe("Referência externa"),
    endDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional()
        .describe("Data de término (YYYY-MM-DD)"),
    maxPayments: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Número máximo de cobranças"),
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
