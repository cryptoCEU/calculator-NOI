export interface ActivoParams {
  askingPrice: number;
  capex: number;
  numUnidades: number;
  superficieMedia: number;
}

export interface IngresosParams {
  rentaMensualPorUnidad: number;
  ocupacion: number; // 0–100
  incrementoAnualRenta: number; // %
  trended: boolean;
}

export interface OpExParams {
  managementFee: number; // % of gross revenue
  mantenimientoReservas: number; // €/unit/year
  seguros: number; // €/year
  impuestosTasas: number; // €/year
  otrosGastos: number; // €/year
}

export interface FinanciacionParams {
  incluirDeuda: boolean;
  ltv: number; // 0–80
  tipoInteres: number; // % annual
  plazo: number; // years
}

export interface MercadoParams {
  yieldOnExit: number; // %
}

export interface HorizonteParams {
  anoVenta: number; // holding period
  costesTransaccion: number; // % of exit value
}

export interface CalculatorInputs {
  activo: ActivoParams;
  ingresos: IngresosParams;
  opex: OpExParams;
  financiacion: FinanciacionParams;
  mercado: MercadoParams;
  horizonte: HorizonteParams;
}

export interface YearCashFlow {
  year: number;
  ingresosBrutos: number;
  opex: number;
  noi: number;
  debtService: number;
  cfUnlevered: number;
  cfLevered: number;
  deudaPendiente: number;
}

export interface CalculatorResults {
  // Static
  totalBasis: number;
  grossRevenueAnual: number;
  totalOpEx: number;
  noiEstabilizado: number;
  yieldOnCost: number; // %
  yieldOnExit: number; // % (from market input)
  spread: number; // bps
  spreadLabel: 'muy-atractiva' | 'interesante' | 'moderado' | 'poco-margen';
  exitValueUntrended: number;
  exitValueTrended: number;

  // Levered
  importePrestamo: number;
  cuotaMensual: number;
  equityInvertido: number;

  // IRR
  irrUnlevered: number | null;
  irrLevered: number | null;
  moic: number | null;

  // KPIs
  noiPorUnidad: number;
  grossYield: number;

  // Cash flows
  cashFlows: YearCashFlow[];
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  activo: {
    askingPrice: 2000000,
    capex: 500000,
    numUnidades: 20,
    superficieMedia: 45,
  },
  ingresos: {
    rentaMensualPorUnidad: 900,
    ocupacion: 88,
    incrementoAnualRenta: 2,
    trended: false,
  },
  opex: {
    managementFee: 8,
    mantenimientoReservas: 600,
    seguros: 8000,
    impuestosTasas: 12000,
    otrosGastos: 5000,
  },
  financiacion: {
    incluirDeuda: false,
    ltv: 60,
    tipoInteres: 4.5,
    plazo: 20,
  },
  mercado: {
    yieldOnExit: 5.5,
  },
  horizonte: {
    anoVenta: 5,
    costesTransaccion: 2,
  },
};

export const PRESET_SCENARIOS: Record<string, Partial<CalculatorInputs>> = {
  'Activo Estabilizado': {
    activo: {
      askingPrice: 3000000,
      capex: 0,
      numUnidades: 25,
      superficieMedia: 50,
    },
    ingresos: {
      rentaMensualPorUnidad: 1100,
      ocupacion: 92,
      incrementoAnualRenta: 1.5,
      trended: false,
    },
    opex: {
      managementFee: 8,
      mantenimientoReservas: 500,
      seguros: 10000,
      impuestosTasas: 15000,
      otrosGastos: 5000,
    },
    financiacion: {
      incluirDeuda: true,
      ltv: 55,
      tipoInteres: 4.5,
      plazo: 20,
    },
    mercado: { yieldOnExit: 5.0 },
    horizonte: { anoVenta: 7, costesTransaccion: 2 },
  },
  Repositioning: {
    activo: {
      askingPrice: 1500000,
      capex: 800000,
      numUnidades: 18,
      superficieMedia: 48,
    },
    ingresos: {
      rentaMensualPorUnidad: 950,
      ocupacion: 85,
      incrementoAnualRenta: 3,
      trended: true,
    },
    opex: {
      managementFee: 9,
      mantenimientoReservas: 700,
      seguros: 9000,
      impuestosTasas: 11000,
      otrosGastos: 6000,
    },
    financiacion: {
      incluirDeuda: true,
      ltv: 65,
      tipoInteres: 5.0,
      plazo: 20,
    },
    mercado: { yieldOnExit: 5.5 },
    horizonte: { anoVenta: 5, costesTransaccion: 2.5 },
  },
  'Value-Add': {
    activo: {
      askingPrice: 2200000,
      capex: 400000,
      numUnidades: 22,
      superficieMedia: 42,
    },
    ingresos: {
      rentaMensualPorUnidad: 850,
      ocupacion: 80,
      incrementoAnualRenta: 2.5,
      trended: true,
    },
    opex: {
      managementFee: 8,
      mantenimientoReservas: 650,
      seguros: 9500,
      impuestosTasas: 13000,
      otrosGastos: 5500,
    },
    financiacion: {
      incluirDeuda: true,
      ltv: 60,
      tipoInteres: 4.75,
      plazo: 20,
    },
    mercado: { yieldOnExit: 5.25 },
    horizonte: { anoVenta: 5, costesTransaccion: 2 },
  },
};
