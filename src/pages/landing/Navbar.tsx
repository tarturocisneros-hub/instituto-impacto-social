import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Misión', anchor: 'mision' },
  { label: 'Programas', anchor: 'programas' },
  { label: 'Impacto', anchor: 'impacto' },
  { label: 'Testimonios', anchor: 'testimonios' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = useCallback((anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          <img src="/logo-white.png" alt="Instituto de Impacto Social México" />
        </a>

        {/* Desktop navigation */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.anchor}>
              <button
                type="button"
                className={styles.navLink}
                onClick={() => handleSmoothScroll(link.anchor)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.authLinks}>
          <Link to="/plataforma/login" className={styles.loginLink}>
            Iniciar sesión
          </Link>
          <Link to="/plataforma/register" className={styles.registerBtn}>
            Registrarse
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú de navegación"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile overlay menu */}
      <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}>
        <div className={styles.overlayHeader}>
          <a href="/" className={styles.logo}>
            <img src="/logo-white.png" alt="Instituto de Impacto Social México" />
          </a>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeMenu}
            aria-label="Cerrar menú de navegación"
          >
            <X size={24} />
          </button>
        </div>

        <ul className={styles.overlayLinks}>
          {navLinks.map((link) => (
            <li key={link.anchor}>
              <button
                type="button"
                className={styles.overlayLink}
                onClick={() => handleSmoothScroll(link.anchor)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.overlayAuth}>
          <Link
            to="/plataforma/login"
            className={styles.overlayLoginLink}
            onClick={closeMenu}
          >
            Iniciar sesión
          </Link>
          <Link
            to="/plataforma/register"
            className={styles.overlayRegisterBtn}
            onClick={closeMenu}
          >
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}
