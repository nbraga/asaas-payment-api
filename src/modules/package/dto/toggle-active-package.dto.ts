import { z } from "zod";

export const toggleActivePackageSchema = z.object({
  isActive: z.boolean(),
});

export type ToggleActivePackageDto = z.infer<typeof toggleActivePackageSchema>;

export function ToggleActivePackageSwaggerDto() {
  return {
    isActive: {
      type: "boolean",
      description: "Status ativo/inativo do pacote",
      example: true,
    },
  };
}
