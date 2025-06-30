export function currencyFormat(number: number) {
  return number.toLocaleString('en-US', { maximumFractionDigits: 2 })
}
