const dayjs = require("dayjs");

export type CycleType = "MONTHLY" | "SEMIANNUALLY" | "YEARLY";

/**
 * Calcula a data de término de uma assinatura baseado no ciclo de pagamento
 * @param cycle - Tipo do ciclo: MONTHLY (1 mês), SEMIANNUALLY (6 meses) ou YEARLY (12 meses)
 * @param startDate - Data de início (opcional, padrão: data atual)
 * @returns Data de término da assinatura
 */
export function calculateSubscriptionEndDate(
  cycle: CycleType,
  startDate?: Date,
): Date {
  const cycleMonths: Record<CycleType, number> = {
    MONTHLY: 1,
    SEMIANNUALLY: 6,
    YEARLY: 12,
  };

  const baseDate = startDate ? dayjs(startDate) : dayjs();
  return baseDate.add(cycleMonths[cycle], "month").toDate();
}

/**
 * Calcula e formata a data de término de uma assinatura no formato YYYY-MM-DD
 * @param cycle - Tipo do ciclo: MONTHLY (1 mês), SEMIANNUALLY (6 meses) ou YEARLY (12 meses)
 * @param startDate - Data de início (opcional, padrão: data atual)
 * @returns Data de término formatada como string no formato YYYY-MM-DD
 */
export function formatSubscriptionEndDate(
  cycle: CycleType,
  startDate?: Date,
): string {
  const cycleMonths: Record<CycleType, number> = {
    MONTHLY: 1,
    SEMIANNUALLY: 6,
    YEARLY: 12,
  };

  const baseDate = startDate ? dayjs(startDate) : dayjs();
  return baseDate.add(cycleMonths[cycle], "month").format("YYYY-MM-DD");
}
