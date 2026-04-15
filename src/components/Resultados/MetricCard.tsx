import styles from './MetricCard.module.css';

type Accent = 'neutral' | 'success' | 'success-light' | 'warning' | 'danger';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string | React.ReactNode;
  accent?: Accent;
  large?: boolean;
}

export default function MetricCard({ label, value, subtext, accent = 'neutral', large }: MetricCardProps) {
  return (
    <div className={`${styles.card} ${styles[`accent-${accent}`]}`}>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.value} ${large ? styles.valueLarge : ''}`}>{value}</span>
      {subtext && <span className={styles.subtext}>{subtext}</span>}
    </div>
  );
}
