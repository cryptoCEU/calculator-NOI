import styles from './Glosario.module.css';

const terms = [
  {
    term: 'Yield on Cost (YoC)',
    definition:
      'NOI estabilizado (12 meses) / Total Basis. Mide la rentabilidad del activo sobre el coste total de adquisición o desarrollo (Asking Price + CapEx). Es la métrica principal para evaluar si el proyecto genera suficiente retorno sobre lo invertido.',
  },
  {
    term: 'Yield on Exit (YoE)',
    definition:
      'Cap Rate de mercado al que se podría vender el activo. Refleja cómo valora el mercado este tipo de activo en el momento de la desinversión. Lo facilita el departamento de research mediante análisis de transacciones comparables en el mercado.',
  },
  {
    term: 'Spread (YoC – YoE)',
    definition:
      'Diferencia entre el Yield on Cost y el Yield on Exit, expresada en puntos básicos (bps). Regla general de valoración: ≥ 250 bps muy atractivo, 150–249 bps interesante, 100–149 bps moderado, < 100 bps poco margen o riesgo. El spread positivo significa que el activo rinde más de lo que el mercado pagaría por él.',
  },
  {
    term: 'IRR / TIR (Dinámico)',
    definition:
      'Tasa Interna de Retorno. A diferencia de métricas estáticas, tiene en cuenta todos los cash flows de la inversión a lo largo del tiempo, incluyendo el servicio de la deuda (préstamo francés). Es la métrica más completa porque incorpora el valor temporal del dinero y el calendario de cobros y pagos.',
  },
  {
    term: 'Múltiplo (MOIC)',
    definition:
      'Money-on-Invested-Capital. Cociente entre el capital total recuperado (incluyendo beneficio) y el capital inicial invertido. Ejemplo: un MOIC de 1,7x significa que recuperas 1,7 veces lo que pusiste. Complementa la IRR porque no depende del tiempo y es intuitivo.',
  },
  {
    term: 'Unlevered / Levered',
    definition:
      'Unlevered (sin apalancamiento): métricas calculadas sin tener en cuenta la deuda. Mide la calidad intrínseca del activo. Levered (con apalancamiento): incorpora el impacto del préstamo. El apalancamiento amplifica tanto los retornos positivos como los negativos.',
  },
  {
    term: 'Total Basis',
    definition:
      'Asking Price + Coste de Construcción / CapEx. Representa el coste real total de la inversión, incluyendo tanto el precio de compra del activo como todas las inversiones adicionales necesarias para su desarrollo, reposicionamiento o reforma.',
  },
  {
    term: 'Trended / Untrended',
    definition:
      'Trended: cálculos que incorporan el incremento anual de rentas proyectado (crecimiento nominal). Untrended: cálculos basados en la renta actual, sin asumir crecimiento futuro. El análisis trended es más optimista pero depende de la materialización del crecimiento de rentas.',
  },
  {
    term: 'Préstamo Francés',
    definition:
      'Sistema de amortización con cuota mensual constante (capital + intereses). Al inicio, la mayor parte de la cuota corresponde a intereses; la amortización de capital aumenta progresivamente a lo largo del tiempo. Es el sistema más habitual en financiación hipotecaria comercial española.',
  },
  {
    term: 'NOI (Net Operating Income)',
    definition:
      'Ingresos Brutos por Rentas × Ocupación − Gastos Operativos (OpEx). Es el beneficio operativo del activo antes de deuda, impuestos y depreciación. Es la base de toda valoración por capitalización de rentas y el numerador de los yields.',
  },
  {
    term: 'Ocupación Estabilizada',
    definition:
      'Porcentaje de unidades arrendadas en condiciones normales de mercado, una vez el activo ha alcanzado su nivel de ocupación de equilibrio. Generalmente entre 85–95% para activos residenciales en mercados principales. Excluye vacíos transitorios de rotación.',
  },
];

export default function Glosario() {
  return (
    <div className={styles.root}>
      <div className={styles.intro}>
        <h2 className={styles.title}>Glosario de términos</h2>
        <p className={styles.subtitle}>
          Referencia de métricas y conceptos utilizados en el análisis de inversión en flex living.
        </p>
      </div>
      <div className={styles.grid}>
        {terms.map((item) => (
          <article key={item.term} className={styles.card}>
            <h3 className={styles.term}>{item.term}</h3>
            <p className={styles.definition}>{item.definition}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
