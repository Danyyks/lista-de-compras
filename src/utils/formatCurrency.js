// Formatador de moeda BRL
const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00'
  return formatter.format(value)
}

// Converte string de input para número (aceita vírgula ou ponto como decimal)
export function parsePrice(str) {
  if (!str && str !== 0) return 0
  const normalized = String(str).replace(',', '.')
  const num = parseFloat(normalized)
  return isNaN(num) ? 0 : num
}
