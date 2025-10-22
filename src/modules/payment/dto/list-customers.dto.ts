import { z } from "zod";

export const listCustomersSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    cpfCnpj: z.string().optional(),
    offset: z.coerce.number().optional().default(0),
    limit: z.coerce.number().optional().default(10),
});

export type ListCustomersDto = z.infer<typeof listCustomersSchema>;
