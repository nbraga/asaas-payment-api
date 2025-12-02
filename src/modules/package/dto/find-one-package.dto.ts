import { ApiProperty } from "@nestjs/swagger";

export class PackageFeatureDto {
  @ApiProperty({
    description: "ID da funcionalidade",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Descrição da funcionalidade",
    example: "Suporte prioritário 24/7",
  })
  description: string;

  @ApiProperty({
    description: "Se a funcionalidade está ativa",
    example: true,
  })
  isActive: boolean;
}

export class FindOnePackageResponseDto {
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
    description: "Limite de processos",
    example: 50,
  })
  processLimit: number;

  @ApiProperty({
    description: "Preço do pacote em centavos",
    example: "9990",
  })
  price: string;

  @ApiProperty({
    description: "Se é o pacote principal",
    example: false,
  })
  isMain: boolean;

  @ApiProperty({
    description: "Se o pacote está ativo",
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "Data de criação",
    example: "2025-10-23T12:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Data de atualização",
    example: "2025-10-23T12:00:00.000Z",
  })
  @ApiProperty({
    description: "Lista de funcionalidades",
    type: [PackageFeatureDto],
  })
  features: PackageFeatureDto[];
}
