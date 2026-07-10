import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [logoError, setLogoError] = useState(false);

  return (
    <section className={styles.hero} aria-label="Presentación principal">
      <div className={styles.content}>
        {logoError ? (
          <span className={styles.logoFallback}>
            Instituto de Impacto Social México
          </span>
        ) : (
          <img
            src="/logo-white.png"
            alt="Instituto de Impacto Social México"
            className={styles.logo}
            width="180"
            height="180"
            onError={() => setLogoError(true)}
          />
        )}

        <h1 className={styles.headline}>
          Formamos emprendedores sociales que transforman México
        </h1>

        <p className={styles.subheadline}>
          Programa de formación para jóvenes que quieren crear empresas con
          propósito social y generar impacto en sus comunidades.
        </p>

        <Link to="/plataforma/register" className={styles.ctaButton}>
          Únete al programa
        </Link>
      </div>
    </section>
  );
}
