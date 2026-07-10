import { impactStats } from './data';
import styles from './ImpactoSection.module.css';

export default function ImpactoSection() {
  return (
    <section id="impacto" className={styles.impacto} aria-label="Impacto">
      <div className={styles.container}>
        <h2 className={styles.heading}>Impacto</h2>

        <div className={styles.statsGrid}>
          {impactStats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
