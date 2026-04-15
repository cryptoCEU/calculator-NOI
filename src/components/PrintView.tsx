import type { CalculatorInputs, CalculatorResults } from '../types/calculator';
import {
  formatCurrency,
  formatPercent,
  formatBps,
  formatMultiple,
  formatNumber,
} from '../utils/formatters';
import styles from './PrintView.module.css';

interface PrintViewProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

const SPREAD_LABELS: Record<CalculatorResults['spreadLabel'], string> = {
  'muy-atractiva': 'Muy Atractiva (≥ 250 bps)',
  interesante: 'Interesante (150–249 bps)',
  moderado: 'Moderado (100–149 bps)',
  'poco-margen': 'Poco margen / Riesgo (< 100 bps)',
};

export default function PrintView({ inputs, results }: PrintViewProps) {
  const today = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.root}>
      {/* ── Cover header ── */}
      <div className={styles.cover}>
        <div className={styles.coverLeft}>
          <div className={styles.logo}>ACTIVUM</div>
          <div className={styles.reportTitle}>Flex Living Yield Calculator</div>
          <div className={styles.reportSubtitle}>Informe de análisis de inversión</div>
        </div>
        <div className={styles.coverRight}>
          <div className={styles.dateLabel}>Fecha</div>
          <div className={styles.dateValue}>{today}</div>
        </div>
      </div>

      {/* ── Inputs summary ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Parámetros de la inversión</h2>
        <div className={styles.paramsGrid}>
          <div className={styles.paramGroup}>
            <div className={styles.paramGroupTitle}>Activo</div>
            <PrintRow label="Asking Price" value={formatCurrency(inputs.activo.askingPrice)} />
            <PrintRow label="CapEx / Construcción" value={formatCurrency(inputs.activo.capex)} />
            <PrintRow label="Total Basis" value={formatCurrency(results.totalBasis)} highlight />
            <PrintRow label="Número de unidades" value={formatNumber(inputs.activo.numUnidades)} />
            <PrintRow label="Superficie media" value={`${inputs.activo.superficieMedia} m²`} />
          </div>
          <div className={styles.paramGroup}>
            <div className={styles.paramGroupTitle}>Ingresos</div>
            <PrintRow label="Renta mensual / unidad" value={formatCurrency(inputs.ingresos.rentaMensualPorUnidad)} />
            <PrintRow label="Ocupación estabilizada" value={formatPercent(inputs.ingresos.ocupacion, 0)} />
            <PrintRow label="Modo de renta" value={inputs.ingresos.trended ? `Trended (+${inputs.ingresos.incrementoAnualRenta}% anual)` : 'Untrended'} />
            <PrintRow label="Renta bruta anual" value={formatCurrency(results.grossRevenueAnual)} highlight />
          </div>
          <div className={styles.paramGroup}>
            <div className={styles.paramGroupTitle}>Gastos Operativos</div>
            <PrintRow label="Management fee" value={formatPercent(inputs.opex.managementFee, 1)} />
            <PrintRow label="Mantenimiento y reservas" value={`${formatCurrency(inputs.opex.mantenimientoReservas)} / ud / año`} />
            <PrintRow label="Seguros" value={formatCurrency(inputs.opex.seguros)} />
            <PrintRow label="Impuestos y tasas" value={formatCurrency(inputs.opex.impuestosTasas)} />
            <PrintRow label="Otros gastos" value={formatCurrency(inputs.opex.otrosGastos)} />
            <PrintRow label="Total OpEx" value={formatCurrency(results.totalOpEx)} highlight />
          </div>
          <div className={styles.paramGroup}>
            <div className={styles.paramGroupTitle}>Financiación</div>
            {inputs.financiacion.incluirDeuda ? (
              <>
                <PrintRow label="LTV" value={formatPercent(inputs.financiacion.ltv, 0)} />
                <PrintRow label="Tipo de interés anual" value={formatPercent(inputs.financiacion.tipoInteres)} />
                <PrintRow label="Plazo" value={`${inputs.financiacion.plazo} años`} />
                <PrintRow label="Importe préstamo" value={formatCurrency(results.importePrestamo)} highlight />
                <PrintRow label="Equity aportado" value={formatCurrency(results.equityInvertido)} highlight />
                <PrintRow label="Cuota mensual (francés)" value={formatCurrency(results.cuotaMensual, 0)} />
              </>
            ) : (
              <PrintRow label="Apalancamiento" value="Sin deuda" />
            )}
          </div>
          <div className={styles.paramGroup}>
            <div className={styles.paramGroupTitle}>Mercado y Horizonte</div>
            <PrintRow label="Yield on Exit (mercado)" value={formatPercent(inputs.mercado.yieldOnExit)} />
            <PrintRow label="Año de venta" value={`Año ${inputs.horizonte.anoVenta}`} />
            <PrintRow label="Costes de transacción" value={formatPercent(inputs.horizonte.costesTransaccion)} />
          </div>
        </div>
      </section>

      {/* ── Key metrics ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Métricas clave</h2>
        <div className={styles.metricsGrid}>
          <MetricBox
            label="NOI Estabilizado"
            value={formatCurrency(results.noiEstabilizado)}
            sub={`${formatCurrency(results.noiPorUnidad)} / unidad / año`}
          />
          <MetricBox
            label="Yield on Cost"
            value={formatPercent(results.yieldOnCost)}
            sub="NOI / Total Basis"
            accent={results.yieldOnCost > results.yieldOnExit ? 'success' : 'danger'}
          />
          <MetricBox
            label="Yield on Exit"
            value={formatPercent(results.yieldOnExit)}
            sub="Cap Rate de mercado"
          />
          <MetricBox
            label="Spread YoC – YoE"
            value={formatBps(results.spread)}
            sub={SPREAD_LABELS[results.spreadLabel]}
            accent={
              results.spreadLabel === 'muy-atractiva' || results.spreadLabel === 'interesante'
                ? 'success'
                : results.spreadLabel === 'moderado'
                ? 'warning'
                : 'danger'
            }
          />
          <MetricBox
            label="Valor de Salida (Untrended)"
            value={formatCurrency(results.exitValueUntrended)}
            sub={`NOI año 0 / YoE`}
          />
          {inputs.ingresos.trended && (
            <MetricBox
              label="Valor de Salida (Trended)"
              value={formatCurrency(results.exitValueTrended)}
              sub={`NOI año ${inputs.horizonte.anoVenta} / YoE`}
            />
          )}
          <MetricBox
            label="IRR Unlevered"
            value={results.irrUnlevered !== null ? formatPercent(results.irrUnlevered) : '—'}
            sub="Sin apalancamiento"
            accent="neutral"
            large
          />
          {inputs.financiacion.incluirDeuda && (
            <MetricBox
              label="IRR Levered"
              value={results.irrLevered !== null ? formatPercent(results.irrLevered) : '—'}
              sub={`Con deuda · LTV ${inputs.financiacion.ltv}%`}
              accent="neutral"
              large
            />
          )}
          <MetricBox
            label="Múltiplo (MOIC)"
            value={formatMultiple(results.moic)}
            sub="Capital recuperado / Capital invertido"
            large
          />
          <MetricBox
            label="Gross Yield"
            value={formatPercent(results.grossYield)}
            sub="Renta bruta / Total Basis"
          />
        </div>
      </section>

      {/* ── Cash flow table ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tabla de Cash Flows anuales</h2>
        <table className={styles.cfTable}>
          <thead>
            <tr>
              <th>Año</th>
              <th>Ingresos Brutos</th>
              <th>OpEx</th>
              <th>NOI</th>
              {inputs.financiacion.incluirDeuda && <th>Debt Service</th>}
              {inputs.financiacion.incluirDeuda && <th>CF Levered</th>}
              <th>CF Unlevered</th>
              {inputs.financiacion.incluirDeuda && <th>Deuda Pendiente</th>}
            </tr>
          </thead>
          <tbody>
            {results.cashFlows.map((row) => (
              <tr key={row.year}>
                <td className={styles.yearCell}>{row.year}</td>
                <td>{formatCurrency(row.ingresosBrutos)}</td>
                <td>{formatCurrency(row.opex)}</td>
                <td className={styles.bold}>{formatCurrency(row.noi)}</td>
                {inputs.financiacion.incluirDeuda && <td>{formatCurrency(row.debtService)}</td>}
                {inputs.financiacion.incluirDeuda && (
                  <td className={row.cfLevered >= 0 ? styles.positive : styles.negative}>
                    {formatCurrency(row.cfLevered)}
                  </td>
                )}
                <td className={row.cfUnlevered >= 0 ? styles.positive : styles.negative}>
                  {formatCurrency(row.cfUnlevered)}
                </td>
                {inputs.financiacion.incluirDeuda && <td>{formatCurrency(row.deudaPendiente)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <span>ACTIVUM — Flex Living Yield Calculator</span>
        <span>Documento generado el {today} · Uso interno</span>
      </div>
    </div>
  );
}

function PrintRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`${styles.paramRow} ${highlight ? styles.paramRowHighlight : ''}`}>
      <span className={styles.paramLabel}>{label}</span>
      <span className={styles.paramValue}>{value}</span>
    </div>
  );
}

function MetricBox({
  label,
  value,
  sub,
  accent = 'neutral',
  large,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: 'success' | 'warning' | 'danger' | 'neutral';
  large?: boolean;
}) {
  return (
    <div className={`${styles.metricBox} ${styles[`accent-${accent}`]}`}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={`${styles.metricValue} ${large ? styles.metricValueLarge : ''}`}>{value}</div>
      {sub && <div className={styles.metricSub}>{sub}</div>}
    </div>
  );
}
