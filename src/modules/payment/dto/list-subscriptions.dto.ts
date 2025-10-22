import { z } from "zod";

export const listSubscriptionsSchema = z.object({
    customer: z.string().optional().describe("ID do cliente"),
    status: z
        .enum(["ACTIVE", "EXPIRED", "OVERDUE", "INACTIVE"])
        .optional()
        .describe("Status da assinatura"),
    offset: z.coerce.number().int().min(0).default(0).describe("Offset"),
    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
        .describe("Limit"),
});

export type ListSubscriptionsDto = z.infer<typeof listSubscriptionsSchema>;
