import styles from './SpreadBadge.module.css';

type Color = 'success' | 'success-light' | 'warning' | 'danger' | 'neutral';

interface SpreadBadgeProps {
  label: string;
  color: Color;
}

export default function SpreadBadge({ label, color }: SpreadBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[color]}`}>
      {label}
    </span>
  );
}
