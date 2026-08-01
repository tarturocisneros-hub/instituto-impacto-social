import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from './ErrorBoundary';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import MisionSection from './MisionSection';
import ProgramasSection from './ProgramasSection';
import TestimoniosSection from './TestimoniosSection';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import styles from './LandingPage.module.css';

const SEO = {
  title: 'Instituto de Impacto Social México – Emprendimiento Social para Jóvenes',
  description:
    'Instituto de Impacto Social México forma jóvenes universitarios en emprendimiento social, creando proyectos con impacto real en comunidades mexicanas.',
  canonicalUrl: 'https://www.impactosocialmexico.org/',
  ogImage: 'https://www.impactosocialmexico.org/og-image.png',
};

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
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

      <header>
        <ErrorBoundary fallback={null}>
          <Navbar />
        </ErrorBoundary>
      </header>

      <main className={styles.main}>
        <ErrorBoundary fallback={null}>
          <HeroSection />
        </ErrorBoundary>

        <ErrorBoundary fallback={null}>
          <MisionSection />
        </ErrorBoundary>

        <ErrorBoundary fallback={null}>
          <ProgramasSection />
        </ErrorBoundary>

        <ErrorBoundary fallback={null}>
          <TestimoniosSection />
        </ErrorBoundary>

        <ErrorBoundary fallback={null}>
          <FinalCTA />
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
