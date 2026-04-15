import { useState, useMemo, useCallback } from 'react';
import type { CalculatorInputs } from './types/calculator';
import { DEFAULT_INPUTS, PRESET_SCENARIOS } from './types/calculator';
import { calculate } from './utils/calculations';
import Header from './components/Header';
import TabNav from './components/TabNav';
import Parametros from './components/Parametros';
import Resultados from './components/Resultados';
import Glosario from './components/Glosario';
import PrintView from './components/PrintView';
import styles from './App.module.css';

export type Tab = 'parametros' | 'resultados' | 'glosario';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('parametros');
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => calculate(inputs), [inputs]);

  const updateInputs = useCallback(
    (patch: Partial<CalculatorInputs>) => {
      setInputs((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  const handlePreset = useCallback((name: string) => {
    const scenario = PRESET_SCENARIOS[name];
    if (scenario) {
      setInputs((prev) => {
        const prevRec = prev as unknown as Record<string, object>;
        const merged = Object.fromEntries(
          Object.entries(scenario).map(([k, v]) => [k, { ...prevRec[k], ...(v as object) }]),
        );
        return { ...prev, ...merged } as CalculatorInputs;
      });
    }
  }, []);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className={styles.app}>
      {/* Always rendered, only visible when printing */}
      <PrintView inputs={inputs} results={results} />

      <Header
        onReset={handleReset}
        onPreset={handlePreset}
        onExportPDF={handleExportPDF}
        presetNames={Object.keys(PRESET_SCENARIOS)}
      />

      {/* Desktop: two-column layout */}
      <div className={styles.desktopLayout}>
        <aside className={styles.sidebar}>
          <Parametros inputs={inputs} onChange={updateInputs} />
        </aside>
        <main className={styles.mainPanel}>
          <div className={styles.desktopTabs}>
            <button
              className={`${styles.desktopTab} ${activeTab === 'resultados' ? styles.desktopTabActive : ''}`}
              onClick={() => setActiveTab('resultados')}
            >
              Resultados
            </button>
            <button
              className={`${styles.desktopTab} ${activeTab === 'glosario' ? styles.desktopTabActive : ''}`}
              onClick={() => setActiveTab('glosario')}
            >
              Glosario
            </button>
          </div>
          <div className={styles.mainContent}>
            {activeTab !== 'parametros' ? (
              activeTab === 'resultados' ? (
                <Resultados results={results} inputs={inputs} />
              ) : (
                <Glosario />
              )
            ) : (
              <Resultados results={results} inputs={inputs} />
            )}
          </div>
        </main>
      </div>

      {/* Mobile: single column with bottom tabs */}
      <div className={styles.mobileLayout}>
        <div className={styles.mobileContent}>
          {activeTab === 'parametros' && (
            <Parametros inputs={inputs} onChange={updateInputs} />
          )}
          {activeTab === 'resultados' && (
            <Resultados results={results} inputs={inputs} />
          )}
          {activeTab === 'glosario' && <Glosario />}
        </div>
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;
