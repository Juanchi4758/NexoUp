export const CURRENCY_CONFIG = {
  code: "CLP",
  symbol: "$",
  name: "Peso Chileno",
  locale: "es-CL",
  decimalPlaces: 0, // Chilean peso doesn't typically use decimal places
}

// Format currency value according to Chilean standards
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: "currency",
    currency: CURRENCY_CONFIG.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Format for display with symbol only
export function formatCurrencySimple(value: number): string {
  return `${CURRENCY_CONFIG.symbol}${Math.round(value).toLocaleString("es-CL")}`
}
