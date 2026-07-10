import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { programas } from './data';
import styles from './ProgramasSection.module.css';

export default function ProgramasSection() {
  return (
    <section id="programas" className={styles.section} aria-label="Programas">
      <div className={styles.container}>
        <h2 className={styles.heading}>Programas</h2>
        <div className={styles.grid}>
          {programas.map((program) => {
            const IconComponent = Icons[program.icon as keyof typeof Icons] as LucideIcon | undefined;

            return (
              <article key={program.title} className={styles.card}>
                <div className={styles.iconWrapper} aria-hidden="true">
                  {IconComponent ? (
                    <IconComponent size={24} />
                  ) : null}
                </div>
                <h3 className={styles.cardTitle}>{program.title}</h3>
                <p className={styles.cardDescription}>{program.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
