import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from './ErrorBoundary';
import BootcampSection from './BootcampSection';
import Footer from './Footer';
import styles from './BootcampPage.module.css';

const SEO = {
  title: 'Bootcamp de Emprendimiento Social en Veracruz – Instituto de Impacto Social México',
  description:
    'Regístrate al Bootcamp de Emprendimiento Social en Veracruz. Dos días intensivos con conferencias, networking y esparcimiento. Beca del 100% disponible.',
  canonicalUrl: 'https://www.impactosocialmexico.org/bootcamp',
  ogImage: 'https://www.impactosocialmexico.org/og-image.png',
};

export default function BootcampPage() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <link rel="canonical" href={SEO.canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="og:url" content={SEO.canonicalUrl} />
        <meta property="og:image" content={SEO.ogImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO.title} />
        <meta name="twitter:description" content={SEO.description} />
        <meta name="twitter:image" content={SEO.ogImage} />
      </Helmet>

      <header className={styles.header}>
        <a href="/" className={styles.logoLink} aria-label="Ir al inicio">
          <img
            src="/logo-white.png"
            alt="Instituto de Impacto Social México"
            className={styles.logo}
            width="160"
            height="48"
          />
        </a>
      </header>

      <main>
        <ErrorBoundary fallback={null}>
          <BootcampSection />
        </ErrorBoundary>
      </main>

      <footer>
        <ErrorBoundary fallback={null}>
          <Footer />
        </ErrorBoundary>
      </footer>
    </div>
  );
}
