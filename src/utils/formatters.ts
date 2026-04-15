// Spanish locale: thousands separator = ".", decimal separator = ","

export function formatCurrency(value: number, decimals = 0): string {
  if (!isFinite(value)) return '—';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  if (!isFinite(value)) return '—';
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  if (!isFinite(value)) return '—';
  return (
    new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value) + '%'
  );
}

export function formatBps(value: number): string {
  if (!isFinite(value)) return '—';
  return (
    new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value)) + ' bps'
  );
}

export function formatMultiple(value: number | null): string {
  if (value === null || !isFinite(value)) return '—';
  return (
    new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + 'x'
  );
}
