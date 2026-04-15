import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  onReset: () => void;
  onPreset: (name: string) => void;
  onExportPDF: () => void;
  presetNames: string[];
}

export default function Header({ onReset, onPreset, onExportPDF, presetNames }: HeaderProps) {
  const [presetsOpen, setPresetsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPresetsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className={`${styles.header} no-print`}>
      <div className={styles.brand}>
        <span className={styles.logo}>ACTIVUM</span>
        <span className={styles.tagline}>Flex Living Yield Calculator</span>
      </div>

      <div className={styles.actions}>
        <div className={styles.presetWrapper} ref={dropdownRef}>
          <button
            className={styles.btnGhost}
            onClick={() => setPresetsOpen((v) => !v)}
            aria-expanded={presetsOpen}
          >
            Escenarios
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {presetsOpen && (
            <div className={styles.dropdown}>
              {presetNames.map((name) => (
                <button
                  key={name}
                  className={styles.dropdownItem}
                  onClick={() => { onPreset(name); setPresetsOpen(false); }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className={styles.btnGhost} onClick={onReset}>
          Reset
        </button>

        <button className={styles.btnPrimary} onClick={onExportPDF}>
          Exportar PDF
        </button>
      </div>
    </header>
  );
}
