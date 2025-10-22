import { z } from "zod";

export const createPaymentSchema = z.object({
    customerId: z.string(),
    billingType: z.enum(["BOLETO", "CREDIT_CARD", "PIX", "UNDEFINED"]),
    value: z.number().positive(),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    customerName: z.string().min(3).optional(),
    customerCpfCnpj: z.string().min(11).max(14).optional(),
    customerEmail: z.email().optional(),
    customerPhone: z.string().optional(),
    description: z.string().optional(),
    externalReference: z.string().optional(),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;

export function CreatePaymentSwaggerDto() {
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
            example: "PIX",
        },
        value: {
            type: "number",
            description: "Valor da cobrança",
            example: 100.0,
        },
        dueDate: {
            type: "string",
            format: "date",
            description: "Data de vencimento (YYYY-MM-DD)",
            example: "2025-10-25",
        },
        description: {
            type: "string",
            description: "Descrição da cobrança",
            example: "Pagamento de teste",
        },
        externalReference: {
            type: "string",
            description: "Referência externa",
            example: "REF-12345",
        },
    };
}
