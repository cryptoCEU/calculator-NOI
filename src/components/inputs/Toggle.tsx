import styles from './Toggle.module.css';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelOn?: string;
  labelOff?: string;
}

export default function Toggle({ label, checked, onChange, labelOn, labelOff }: ToggleProps) {
  return (
    <label className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      <div className={styles.right}>
        {(labelOff || labelOn) && (
          <span className={styles.stateLabel}>
            {checked ? labelOn : labelOff}
          </span>
        )}
        <button
          role="switch"
          aria-checked={checked}
          className={`${styles.track} ${checked ? styles.trackOn : ''}`}
          onClick={() => onChange(!checked)}
          type="button"
        >
          <span className={`${styles.thumb} ${checked ? styles.thumbOn : ''}`} />
        </button>
      </div>
    </label>
  );
}
