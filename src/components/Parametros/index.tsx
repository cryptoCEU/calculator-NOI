import type { CalculatorInputs } from '../../types/calculator';
import CollapsibleCard from '../inputs/CollapsibleCard';
import NumberInput from '../inputs/NumberInput';
import SliderInput from '../inputs/SliderInput';
import Toggle from '../inputs/Toggle';
import { formatCurrency } from '../../utils/formatters';
import styles from './Parametros.module.css';

interface ParametrosProps {
  inputs: CalculatorInputs;
  onChange: (patch: Partial<CalculatorInputs>) => void;
}

export default function Parametros({ inputs, onChange }: ParametrosProps) {
  const { activo, ingresos, opex, financiacion, mercado, horizonte } = inputs;

  const totalBasis = activo.askingPrice + activo.capex;
  const importePrestamo = financiacion.incluirDeuda ? totalBasis * (financiacion.ltv / 100) : 0;
  const equity = totalBasis - importePrestamo;

  // French mortgage monthly payment
  const cuota = (() => {
    if (!financiacion.incluirDeuda || importePrestamo <= 0) return 0;
    const r = financiacion.tipoInteres / 100 / 12;
    const n = financiacion.plazo * 12;
    if (r === 0) return importePrestamo / n;
    return (importePrestamo * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  })();

  return (
    <div className={styles.root}>
      {/* ── Activo ── */}
      <CollapsibleCard title="Activo">
        <NumberInput
          label="Asking Price"
          value={activo.askingPrice}
          onChange={(v) => onChange({ activo: { ...activo, askingPrice: v } })}
          prefix="€"
          min={0}
          step={10000}
        />
        <NumberInput
          label="Coste de Construcción / CapEx"
          value={activo.capex}
          onChange={(v) => onChange({ activo: { ...activo, capex: v } })}
          prefix="€"
          min={0}
          step={10000}
        />
        <div className={styles.computed}>
          Total Basis = {formatCurrency(totalBasis)}
        </div>
        <NumberInput
          label="Número de unidades"
          value={activo.numUnidades}
          onChange={(v) => onChange({ activo: { ...activo, numUnidades: Math.max(1, Math.round(v)) } })}
          min={1}
          step={1}
        />
        <NumberInput
          label="Superficie media por unidad"
          value={activo.superficieMedia}
          onChange={(v) => onChange({ activo: { ...activo, superficieMedia: v } })}
          suffix="m²"
          min={1}
          step={1}
        />
      </CollapsibleCard>

      {/* ── Ingresos ── */}
      <CollapsibleCard title="Ingresos">
        <NumberInput
          label="Renta media mensual por unidad"
          value={ingresos.rentaMensualPorUnidad}
          onChange={(v) => onChange({ ingresos: { ...ingresos, rentaMensualPorUnidad: v } })}
          prefix="€"
          min={0}
          step={50}
        />
        <SliderInput
          label="Ocupación estabilizada"
          value={ingresos.ocupacion}
          onChange={(v) => onChange({ ingresos: { ...ingresos, ocupacion: v } })}
          min={0}
          max={100}
          step={1}
          suffix="%"
        />
        <div className={styles.trendedRow}>
          <Toggle
            label="Incremento anual de renta"
            checked={ingresos.trended}
            onChange={(v) => onChange({ ingresos: { ...ingresos, trended: v } })}
            labelOn="Trended"
            labelOff="Untrended"
          />
          {ingresos.trended && (
            <NumberInput
              label="Tasa de incremento anual"
              value={ingresos.incrementoAnualRenta}
              onChange={(v) => onChange({ ingresos: { ...ingresos, incrementoAnualRenta: v } })}
              suffix="%"
              min={-5}
              max={20}
              step={0.1}
            />
          )}
        </div>
      </CollapsibleCard>

      {/* ── OpEx ── */}
      <CollapsibleCard title="Gastos Operativos (OpEx)" defaultOpen={false}>
        <SliderInput
          label="Management fee"
          value={opex.managementFee}
          onChange={(v) => onChange({ opex: { ...opex, managementFee: v } })}
          min={0}
          max={20}
          step={0.5}
          suffix="%"
          decimals={1}
        />
        <NumberInput
          label="Mantenimiento y reservas"
          value={opex.mantenimientoReservas}
          onChange={(v) => onChange({ opex: { ...opex, mantenimientoReservas: v } })}
          prefix="€"
          suffix="/unidad/año"
          min={0}
          step={50}
        />
        <NumberInput
          label="Seguros"
          value={opex.seguros}
          onChange={(v) => onChange({ opex: { ...opex, seguros: v } })}
          prefix="€"
          suffix="/año"
          min={0}
          step={500}
        />
        <NumberInput
          label="Impuestos y tasas municipales"
          value={opex.impuestosTasas}
          onChange={(v) => onChange({ opex: { ...opex, impuestosTasas: v } })}
          prefix="€"
          suffix="/año"
          min={0}
          step={500}
        />
        <NumberInput
          label="Otros gastos"
          value={opex.otrosGastos}
          onChange={(v) => onChange({ opex: { ...opex, otrosGastos: v } })}
          prefix="€"
          suffix="/año"
          min={0}
          step={500}
        />
      </CollapsibleCard>

      {/* ── Financiación ── */}
      <CollapsibleCard title="Financiación (Levered)" defaultOpen={false}>
        <Toggle
          label="¿Incluir deuda?"
          checked={financiacion.incluirDeuda}
          onChange={(v) => onChange({ financiacion: { ...financiacion, incluirDeuda: v } })}
          labelOn="Sí"
          labelOff="No"
        />
        {financiacion.incluirDeuda && (
          <>
            <SliderInput
              label="LTV"
              value={financiacion.ltv}
              onChange={(v) => onChange({ financiacion: { ...financiacion, ltv: v } })}
              min={0}
              max={80}
              step={1}
              suffix="%"
            />
            <NumberInput
              label="Tipo de interés anual"
              value={financiacion.tipoInteres}
              onChange={(v) => onChange({ financiacion: { ...financiacion, tipoInteres: v } })}
              suffix="%"
              min={0}
              max={20}
              step={0.25}
            />
            <NumberInput
              label="Plazo del préstamo"
              value={financiacion.plazo}
              onChange={(v) => onChange({ financiacion: { ...financiacion, plazo: Math.max(1, Math.round(v)) } })}
              suffix="años"
              min={1}
              max={30}
              step={1}
            />
            <div className={styles.computedGroup}>
              <div className={styles.computedRow}>
                <span>Importe préstamo</span>
                <strong>{formatCurrency(importePrestamo)}</strong>
              </div>
              <div className={styles.computedRow}>
                <span>Equity aportado</span>
                <strong>{formatCurrency(equity)}</strong>
              </div>
              <div className={styles.computedRow}>
                <span>Cuota mensual (francés)</span>
                <strong>{formatCurrency(cuota, 2)}</strong>
              </div>
            </div>
          </>
        )}
      </CollapsibleCard>

      {/* ── Mercado ── */}
      <CollapsibleCard title="Mercado" defaultOpen={false}>
        <NumberInput
          label="Yield on Exit / Cap Rate de mercado"
          value={mercado.yieldOnExit}
          onChange={(v) => onChange({ mercado: { ...mercado, yieldOnExit: v } })}
          suffix="%"
          min={0.1}
          max={20}
          step={0.25}
          hint="Cap Rate al que se puede vender el activo. Datos de research."
        />
      </CollapsibleCard>

      {/* ── Horizonte ── */}
      <CollapsibleCard title="Horizonte de inversión" defaultOpen={false}>
        <SliderInput
          label="Año de venta (holding period)"
          value={horizonte.anoVenta}
          onChange={(v) => onChange({ horizonte: { ...horizonte, anoVenta: v } })}
          min={1}
          max={15}
          step={1}
          suffix=" años"
        />
        <NumberInput
          label="Costes de transacción en venta"
          value={horizonte.costesTransaccion}
          onChange={(v) => onChange({ horizonte: { ...horizonte, costesTransaccion: v } })}
          suffix="%"
          min={0}
          max={10}
          step={0.25}
        />
      </CollapsibleCard>
    </div>
  );
}
