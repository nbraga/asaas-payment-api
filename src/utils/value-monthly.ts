export const discounts = {
  MONTHLY: 0,
  SEMIANNUALLY: 0.15,
  ANNUAL: 0.3,
};

export const cycleLabels = {
  MONTHLY: "Mensal",
  SEMIANNUALLY: "Semestral",
  YEARLY: "Anual",
};

export const calculateDiscountedMonthlyPrice = (
  price: number,
  cycle: "MONTHLY" | "SEMIANNUALLY" | "YEARLY",
) => {
  const discount =
    cycle === "MONTHLY" ? 0 : cycle === "SEMIANNUALLY" ? 0.15 : 0.3;
  return (price / 100) * (1 - discount);
};

export const calculateTotalPrice = (
  basePriceInCents: number,
  cycle: "MONTHLY" | "SEMIANNUALLY" | "YEARLY",
) => {
  const monthlyPrice = calculateDiscountedMonthlyPrice(basePriceInCents, cycle);
  if (cycle === "MONTHLY") {
    return monthlyPrice;
  } else if (cycle === "SEMIANNUALLY") {
    return monthlyPrice * 6;
  } else {
    return monthlyPrice * 12;
  }
};
