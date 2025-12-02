import { ApiProperty } from "@nestjs/swagger";

export class SoftDeletePackageResponseDto {
  @ApiProperty({
    description: "Mensagem de sucesso",
    example: "Pacote deletado com sucesso",
  })
  message: string;
}
