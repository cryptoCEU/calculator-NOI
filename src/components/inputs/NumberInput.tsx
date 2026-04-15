import styles from './NumberInput.module.css';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  prefix?: string;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  hint?: string;
  error?: string;
  computed?: string; // auto-calculated display
}

export default function NumberInput({
  label,
  value,
  onChange,
  suffix,
  prefix,
  min,
  max,
  step = 1,
  hint,
  error,
  computed,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(',', '.');
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      if (min !== undefined && num < min) return onChange(min);
      if (max !== undefined && num > max) return onChange(max);
      onChange(num);
    } else if (raw === '' || raw === '-') {
      onChange(0);
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <div className={`${styles.inputRow} ${error ? styles.hasError : ''}`}>
        {prefix && <span className={styles.affix}>{prefix}</span>}
        <input
          type="number"
          className={styles.input}
          value={value === 0 ? '' : value}
          placeholder="0"
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
        />
        {suffix && <span className={styles.affix}>{suffix}</span>}
      </div>
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.error}>{error}</p>}
      {computed && <p className={styles.computed}>{computed}</p>}
    </div>
  );
}
