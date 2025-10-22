import { z } from "zod";

export const webhookEventSchema = z.object({
    event: z.string(),
    payment: z.object({
        id: z.string(),
        customer: z.string(),
        status: z.string(),
        value: z.number(),
        netValue: z.number(),
        billingType: z.string(),
        dueDate: z.string(),
        confirmedDate: z.string().optional(),
        paymentDate: z.string().optional(),
    }),
});

export type WebhookEventDto = z.infer<typeof webhookEventSchema>;
