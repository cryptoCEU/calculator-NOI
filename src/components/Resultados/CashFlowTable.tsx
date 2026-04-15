import type { YearCashFlow } from '../../types/calculator';
import { formatCurrency } from '../../utils/formatters';
import styles from './CashFlowTable.module.css';

interface CashFlowTableProps {
  cashFlows: YearCashFlow[];
  incluirDeuda: boolean;
}

export default function CashFlowTable({ cashFlows, incluirDeuda }: CashFlowTableProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollX}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Año</th>
              <th>Ingresos Brutos</th>
              <th>OpEx</th>
              <th>NOI</th>
              {incluirDeuda && <th>Debt Service</th>}
              {incluirDeuda && <th>CF Levered</th>}
              <th>CF Unlevered</th>
              {incluirDeuda && <th>Deuda Pendiente</th>}
            </tr>
          </thead>
          <tbody>
            {cashFlows.map((row) => (
              <tr key={row.year}>
                <td className={styles.yearCell}>{row.year}</td>
                <td>{formatCurrency(row.ingresosBrutos)}</td>
                <td className={styles.negative}>{formatCurrency(row.opex)}</td>
                <td className={styles.strong}>{formatCurrency(row.noi)}</td>
                {incluirDeuda && (
                  <td className={styles.negative}>{formatCurrency(row.debtService)}</td>
                )}
                {incluirDeuda && (
                  <td className={row.cfLevered >= 0 ? styles.positive : styles.negative}>
                    {formatCurrency(row.cfLevered)}
                  </td>
                )}
                <td className={row.cfUnlevered >= 0 ? styles.positive : styles.negative}>
                  {formatCurrency(row.cfUnlevered)}
                </td>
                {incluirDeuda && <td>{formatCurrency(row.deudaPendiente)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
