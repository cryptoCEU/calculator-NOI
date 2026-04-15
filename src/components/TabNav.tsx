import type { Tab } from '../App';
import styles from './TabNav.module.css';

interface TabNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'parametros', label: 'Parámetros', icon: '⊞' },
  { id: 'resultados', label: 'Resultados', icon: '◈' },
  { id: 'glosario', label: 'Glosario', icon: '≡' },
];

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className={`${styles.nav} no-print`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className={styles.icon} aria-hidden="true">{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
