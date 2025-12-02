import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const createPackageSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  type: z.enum(["BRONZE", "SILVER", "GOLD"]),
  processLimit: z
    .number()
    .int()
    .positive("Limite de processos deve ser positivo")
    .optional()
    .nullable(),
  price: z.string().min(1, "Preço obrigatório"),
  isMain: z.boolean().default(false),
  features: z
    .array(
      z.object({
        description: z
          .string()
          .min(3, "Descrição deve ter no mínimo 3 caracteres"),
      }),
    )
    .optional()
    .default([]),
});

export type CreatePackageDto = z.infer<typeof createPackageSchema>;

export class CreatePackageSwaggerDto {
  @ApiProperty({
    description: "Nome do pacote",
    example: "Pacote Premium",
    minLength: 3,
  })
  name: string;

  @ApiProperty({
    description: "Limite de processos que podem ser criados",
    example: 50,
    minimum: 1,
  })
  processLimit: number;

  @ApiProperty({
    description: "Preço do pacote em centavos (ex: R$ 99,90 = 9990)",
    example: 9990,
    minimum: 0,
  })
  price: number;

  @ApiProperty({
    description: "Se é o pacote principal/padrão",
    example: false,
    default: false,
  })
  isMain: boolean;

  @ApiProperty({
    description: "Lista de funcionalidades do pacote",
    example: [
      { description: "Suporte prioritário" },
      { description: "Relatórios avançados" },
      { description: "API access" },
    ],
    type: "array",
    items: {
      type: "object",
      properties: {
        description: { type: "string", minLength: 3 },
      },
    },
    required: false,
    default: [],
  })
  features?: { description: string }[];
}

export class CreatePackageResponseDto {
  @ApiProperty({
    description: "Mensagem de sucesso",
    example: "Pacote criado com sucesso",
  })
  message: string;
}
