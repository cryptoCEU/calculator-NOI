import type {
  CalculatorInputs,
  CalculatorResults,
  YearCashFlow,
} from '../types/calculator';

// ─── French amortization (cuota constante) ───────────────────────────────────

export function calcCuotaMensual(
  principal: number,
  tasaAnual: number,
  plazoAnios: number,
): number {
  if (principal <= 0 || plazoAnios <= 0) return 0;
  const r = tasaAnual / 100 / 12;
  const n = plazoAnios * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calcDeudaPendiente(
  principal: number,
  tasaAnual: number,
  plazoAnios: number,
  aniosPagados: number,
): number {
  if (principal <= 0 || plazoAnios <= 0) return 0;
  const r = tasaAnual / 100 / 12;
  const n = plazoAnios * 12;
  const k = aniosPagados * 12;
  if (r === 0) return principal * (1 - k / n);
  return (principal * (Math.pow(1 + r, n) - Math.pow(1 + r, k))) / (Math.pow(1 + r, n) - 1);
}

// ─── IRR via Newton-Raphson / bisection ──────────────────────────────────────

function npv(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + rate, t), 0);
}

function npvDerivative(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce(
    (acc, cf, t) => (t === 0 ? acc : acc - (t * cf) / Math.pow(1 + rate, t + 1)),
    0,
  );
}

export function calcIRR(cashFlows: number[]): number | null {
  // Validate: must have at least one negative and one positive
  const hasNeg = cashFlows.some((cf) => cf < 0);
  const hasPos = cashFlows.some((cf) => cf > 0);
  if (!hasNeg || !hasPos) return null;

  // Try Newton-Raphson first
  let rate = 0.1;
  for (let i = 0; i < 100; i++) {
    const nv = npv(rate, cashFlows);
    const dnv = npvDerivative(rate, cashFlows);
    if (Math.abs(dnv) < 1e-12) break;
    const newRate = rate - nv / dnv;
    if (Math.abs(newRate - rate) < 1e-8) return newRate;
    rate = newRate;
    if (rate < -0.9999) rate = 0.1; // reset if diverging
  }

  // Fallback: bisection
  let lo = -0.9999;
  let hi = 10.0;
  if (npv(lo, cashFlows) * npv(hi, cashFlows) > 0) return null;

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(lo, cashFlows) * npv(mid, cashFlows) <= 0) {
      hi = mid;
    } else {
      lo = mid;
    }
    if (hi - lo < 1e-8) return (lo + hi) / 2;
  }

  return (lo + hi) / 2;
}

// ─── Main calculation engine ─────────────────────────────────────────────────

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const { activo, ingresos, opex, financiacion, mercado, horizonte } = inputs;

  // ── Basis ──
  const totalBasis = activo.askingPrice + activo.capex;

  // ── Gross Revenue (Year 0 stabilized) ──
  const rentaAnualBruta =
    ingresos.rentaMensualPorUnidad * 12 * activo.numUnidades;
  const grossRevenueAnual = rentaAnualBruta * (ingresos.ocupacion / 100);

  // ── OpEx ──
  const managementFeeAmount = grossRevenueAnual * (opex.managementFee / 100);
  const mantenimientoTotal = opex.mantenimientoReservas * activo.numUnidades;
  const totalOpEx =
    managementFeeAmount +
    mantenimientoTotal +
    opex.seguros +
    opex.impuestosTasas +
    opex.otrosGastos;

  // ── NOI ──
  const noiEstabilizado = grossRevenueAnual - totalOpEx;

  // ── Yield on Cost ──
  const yieldOnCost = totalBasis > 0 ? (noiEstabilizado / totalBasis) * 100 : 0;

  // ── Spread (bps) ──
  const spread = (yieldOnCost - mercado.yieldOnExit) * 100;
  let spreadLabel: CalculatorResults['spreadLabel'];
  if (spread >= 250) spreadLabel = 'muy-atractiva';
  else if (spread >= 150) spreadLabel = 'interesante';
  else if (spread >= 100) spreadLabel = 'moderado';
  else spreadLabel = 'poco-margen';

  // ── Financing ──
  const importePrestamo = financiacion.incluirDeuda
    ? totalBasis * (financiacion.ltv / 100)
    : 0;
  const equityInvertido = totalBasis - importePrestamo;
  const cuotaMensual = financiacion.incluirDeuda
    ? calcCuotaMensual(importePrestamo, financiacion.tipoInteres, financiacion.plazo)
    : 0;
  const debtServiceAnual = cuotaMensual * 12;

  // ── Cash flows year by year ──
  const cashFlows: YearCashFlow[] = [];
  const n = horizonte.anoVenta;
  const growthRate = ingresos.trended ? ingresos.incrementoAnualRenta / 100 : 0;

  for (let yr = 1; yr <= n; yr++) {
    const growthFactor = Math.pow(1 + growthRate, yr - 1);
    const rentaGrowthFactor = Math.pow(1 + growthRate, yr - 1);

    // Gross revenue with trended rent
    const ingresosBrutos =
      rentaAnualBruta * (ingresos.ocupacion / 100) * rentaGrowthFactor;

    // OpEx grows with management fee; fixed costs stay flat
    const mgmtFee = ingresosBrutos * (opex.managementFee / 100);
    const opexTotal =
      mgmtFee +
      mantenimientoTotal * growthFactor +
      opex.seguros +
      opex.impuestosTasas +
      opex.otrosGastos;

    const noi = ingresosBrutos - opexTotal;
    const deuda = financiacion.incluirDeuda
      ? calcDeudaPendiente(
          importePrestamo,
          financiacion.tipoInteres,
          financiacion.plazo,
          yr,
        )
      : 0;

    cashFlows.push({
      year: yr,
      ingresosBrutos,
      opex: opexTotal,
      noi,
      debtService: debtServiceAnual,
      cfUnlevered: noi,
      cfLevered: noi - debtServiceAnual,
      deudaPendiente: deuda,
    });
  }

  // ── Exit Value ──
  const noiUntrended = noiEstabilizado; // year-0 NOI (no growth)
  const noiAtSale = cashFlows[n - 1]?.noi ?? noiEstabilizado;
  const yoe = mercado.yieldOnExit / 100;
  const exitValueUntrended = yoe > 0 ? noiUntrended / yoe : 0;
  const exitValueTrended = yoe > 0 ? noiAtSale / yoe : 0;
  const exitValue = ingresos.trended ? exitValueTrended : exitValueUntrended;

  const costesTransaccionEur = exitValue * (horizonte.costesTransaccion / 100);
  const netExitValue = exitValue - costesTransaccionEur;
  const deudaAlSalir = financiacion.incluirDeuda
    ? calcDeudaPendiente(
        importePrestamo,
        financiacion.tipoInteres,
        financiacion.plazo,
        n,
      )
    : 0;

  // ── IRR Unlevered ──
  const cfUnlevered: number[] = [
    -totalBasis,
    ...cashFlows.slice(0, n - 1).map((cf) => cf.noi),
    (cashFlows[n - 1]?.noi ?? 0) + netExitValue,
  ];
  const irrUnlevered = calcIRR(cfUnlevered);

  // ── IRR Levered ──
  let irrLevered: number | null = null;
  let moic: number | null = null;

  if (financiacion.incluirDeuda) {
    const cfLevered: number[] = [
      -equityInvertido,
      ...cashFlows.slice(0, n - 1).map((cf) => cf.noi - debtServiceAnual),
      (cashFlows[n - 1]?.noi ?? 0) -
        debtServiceAnual +
        netExitValue -
        deudaAlSalir,
    ];
    irrLevered = calcIRR(cfLevered);

    const totalInflows =
      cashFlows.reduce((s, cf) => s + cf.noi - debtServiceAnual, 0) +
      netExitValue -
      deudaAlSalir;
    moic = equityInvertido > 0 ? (equityInvertido + totalInflows) / equityInvertido : null;
  } else {
    const totalInflows =
      cashFlows.reduce((s, cf) => s + cf.noi, 0) + netExitValue;
    moic = totalBasis > 0 ? (totalBasis + totalInflows) / totalBasis : null;
  }

  return {
    totalBasis,
    grossRevenueAnual,
    totalOpEx,
    noiEstabilizado,
    yieldOnCost,
    yieldOnExit: mercado.yieldOnExit,
    spread,
    spreadLabel,
    exitValueUntrended,
    exitValueTrended,
    importePrestamo,
    cuotaMensual,
    equityInvertido,
    irrUnlevered: irrUnlevered !== null ? irrUnlevered * 100 : null,
    irrLevered: irrLevered !== null ? irrLevered * 100 : null,
    moic,
    noiPorUnidad: activo.numUnidades > 0 ? noiEstabilizado / activo.numUnidades : 0,
    grossYield: totalBasis > 0 ? (rentaAnualBruta / totalBasis) * 100 : 0,
    cashFlows,
  };
}
