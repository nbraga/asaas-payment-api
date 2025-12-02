import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const findManyPackagesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type FindManyPackagesDto = z.infer<typeof findManyPackagesSchema>;

export class FindManyPackagesQueryDto {
  @ApiProperty({
    description: "Número da página",
    example: 1,
    required: false,
    default: 1,
  })
  page?: number;

  @ApiProperty({
    description: "Quantidade de itens por página",
    example: 10,
    required: false,
    default: 10,
    maximum: 100,
  })
  limit?: number;

  @ApiProperty({
    description: "Ordenação por nome",
    example: "asc",
    required: false,
    default: "asc",
    enum: ["asc", "desc"],
  })
  order?: "asc" | "desc";
}

export class PackageItemDto {
  @ApiProperty({
    description: "ID do pacote",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Nome do pacote",
    example: "Pacote Premium",
  })
  name: string;

  @ApiProperty({
    description: "Preço do pacote em centavos",
    example: 9990,
  })
  price: string;

  @ApiProperty({
    description: "Se é o pacote principal",
    example: false,
  })
  isMain: boolean;
}

export class FindManyPackagesResponseDto {
  @ApiProperty({
    description: "Lista de pacotes",
    type: [PackageItemDto],
  })
  packages: PackageItemDto[];

  @ApiProperty({
    description: "Total de pacotes",
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: "Página atual",
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: "Limite de itens por página",
    example: 10,
  })
  limit: number;
}
