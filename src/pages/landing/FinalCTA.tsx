import { Link } from 'react-router-dom';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  return (
    <section className={styles.section} aria-label="Llamada a la acción final">
      <div className={styles.container}>
        <h2 className={styles.headline}>
          Comienza tu camino como emprendedor social
        </h2>

        <p className={styles.supporting}>
          Únete a cientos de jóvenes que están transformando sus comunidades a
          través del emprendimiento social. El próximo programa comienza pronto.
        </p>

        <Link to="/plataforma/register" className={styles.ctaButton}>
          Registrarse ahora
        </Link>
      </div>
    </section>
  );
}
