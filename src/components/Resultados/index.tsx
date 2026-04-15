import { useState } from 'react';
import type { CalculatorResults, CalculatorInputs } from '../../types/calculator';
import {
  formatCurrency,
  formatPercent,
  formatBps,
  formatMultiple,
} from '../../utils/formatters';
import MetricCard from './MetricCard';
import SpreadBadge from './SpreadBadge';
import CashFlowTable from './CashFlowTable';
import styles from './Resultados.module.css';

interface ResultadosProps {
  results: CalculatorResults;
  inputs: CalculatorInputs;
}

const SPREAD_CONFIG = {
  'muy-atractiva': { label: 'Muy Atractiva', color: 'success' as const },
  interesante: { label: 'Interesante', color: 'success-light' as const },
  moderado: { label: 'Moderado', color: 'warning' as const },
  'poco-margen': { label: 'Poco margen / Riesgo', color: 'danger' as const },
};

export default function Resultados({ results, inputs }: ResultadosProps) {
  const [tableOpen, setTableOpen] = useState(false);
  const spreadConfig = SPREAD_CONFIG[results.spreadLabel];

  const yocColor =
    results.yieldOnCost > results.yieldOnExit ? 'success' : 'danger';

  return (
    <div className={styles.root}>
      <h2 className={styles.sectionTitle}>Métricas Estáticas</h2>

      {/* ── Yield metrics ── */}
      <div className={styles.grid3}>
        <MetricCard
          label="Yield on Cost"
          value={formatPercent(results.yieldOnCost)}
          subtext="NOI estabilizado / Total Basis"
          accent={yocColor}
        />
        <MetricCard
          label="Yield on Exit (mercado)"
          value={formatPercent(results.yieldOnExit)}
          subtext="Cap Rate de mercado"
          accent="neutral"
        />
        <MetricCard
          label="Spread YoC – YoE"
          value={formatBps(results.spread)}
          subtext={<SpreadBadge label={spreadConfig.label} color={spreadConfig.color} />}
          accent={spreadConfig.color}
        />
      </div>

      {/* ── Basis & Revenue ── */}
      <div className={styles.grid2}>
        <MetricCard
          label="Total Basis"
          value={formatCurrency(results.totalBasis)}
          subtext="Asking Price + CapEx"
          accent="neutral"
        />
        <MetricCard
          label="NOI Estabilizado"
          value={formatCurrency(results.noiEstabilizado)}
          subtext={`${formatCurrency(results.noiPorUnidad)} / unidad / año`}
          accent="neutral"
        />
      </div>

      {/* ── Exit values ── */}
      <div className={styles.grid2}>
        <MetricCard
          label="Valor de Salida (Untrended)"
          value={formatCurrency(results.exitValueUntrended)}
          subtext={`NOI año 0 / YoE (${inputs.horizonte.anoVenta} años)`}
          accent="neutral"
        />
        {inputs.ingresos.trended ? (
          <MetricCard
            label="Valor de Salida (Trended)"
            value={formatCurrency(results.exitValueTrended)}
            subtext={`NOI año ${inputs.horizonte.anoVenta} / YoE`}
            accent="neutral"
          />
        ) : (
          <MetricCard
            label="Gross Yield"
            value={formatPercent(results.grossYield)}
            subtext="Renta bruta / Total Basis"
            accent="neutral"
          />
        )}
      </div>

      <h2 className={styles.sectionTitle}>Métricas Dinámicas (IRR / TIR)</h2>

      <div className={styles.grid2}>
        <MetricCard
          label="IRR Unlevered"
          value={results.irrUnlevered !== null ? formatPercent(results.irrUnlevered) : '—'}
          subtext="Sin deuda · valor temporal del dinero"
          accent={results.irrUnlevered !== null && results.irrUnlevered > results.yieldOnExit ? 'success' : 'neutral'}
          large
        />
        {inputs.financiacion.incluirDeuda ? (
          <MetricCard
            label="IRR Levered"
            value={results.irrLevered !== null ? formatPercent(results.irrLevered) : '—'}
            subtext={`Con deuda · LTV ${inputs.financiacion.ltv}%`}
            accent={results.irrLevered !== null && results.irrLevered > results.yieldOnExit ? 'success' : 'neutral'}
            large
          />
        ) : (
          <MetricCard
            label="IRR Levered"
            value="—"
            subtext="Activar deuda para calcular"
            accent="neutral"
            large
          />
        )}
      </div>

      <div className={styles.grid2}>
        <MetricCard
          label="Múltiplo (MOIC)"
          value={formatMultiple(results.moic)}
          subtext="(Equity + Beneficio) / Equity"
          accent="neutral"
          large
        />
        <MetricCard
          label="Equity Invertido"
          value={formatCurrency(results.equityInvertido)}
          subtext={inputs.financiacion.incluirDeuda
            ? `Total Basis − Préstamo (${formatCurrency(results.importePrestamo)})`
            : 'Sin apalancamiento'}
          accent="neutral"
        />
      </div>

      {/* ── KPIs ── */}
      <h2 className={styles.sectionTitle}>KPIs de Contexto</h2>
      <div className={styles.kpiGrid}>
        <div className={styles.kpi}>
          <span className={styles.kpiLabel}>Renta bruta anual</span>
          <span className={styles.kpiValue}>{formatCurrency(results.grossRevenueAnual)}</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiLabel}>Total OpEx</span>
          <span className={styles.kpiValue}>{formatCurrency(results.totalOpEx)}</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiLabel}>NOI / unidad</span>
          <span className={styles.kpiValue}>{formatCurrency(results.noiPorUnidad)}</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiLabel}>Gross Yield</span>
          <span className={styles.kpiValue}>{formatPercent(results.grossYield)}</span>
        </div>
        {inputs.financiacion.incluirDeuda && (
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Cuota mensual</span>
            <span className={styles.kpiValue}>{formatCurrency(results.cuotaMensual, 0)}</span>
          </div>
        )}
      </div>

      {/* ── Cash Flow Table ── */}
      <div className={styles.tableSection}>
        <button
          className={styles.tableToggle}
          onClick={() => setTableOpen((v) => !v)}
          aria-expanded={tableOpen}
        >
          <span>Tabla de Cash Flows</span>
          <svg
            className={`${styles.chevron} ${tableOpen ? styles.chevronOpen : ''}`}
            width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {tableOpen && (
          <CashFlowTable
            cashFlows={results.cashFlows}
            incluirDeuda={inputs.financiacion.incluirDeuda}
          />
        )}
      </div>
    </div>
  );
}
