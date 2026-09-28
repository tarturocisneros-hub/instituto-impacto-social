import { useCallback } from 'react';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  const scrollToBootcamp = useCallback(() => {
    const element = document.getElementById('bootcamp');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section className={styles.section} aria-label="Llamada a la acción final">
      <div className={styles.container}>
        <h2 className={styles.headline}>
          Comienza tu camino como emprendedor social
        </h2>

        <p className={styles.supporting}>
          Únete a cientos de jóvenes que están transformando sus comunidades a
          través del emprendimiento social. Regístrate y obtén una beca del 100%.
        </p>

        <button
          type="button"
          className={styles.ctaButton}
          onClick={scrollToBootcamp}
        >
          Regístrate al bootcamp
        </button>
      </div>
    </section>
  );
}
