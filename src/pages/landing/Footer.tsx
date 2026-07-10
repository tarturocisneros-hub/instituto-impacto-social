import { Mail, Instagram, Facebook, Linkedin } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { socialLinks, contactEmail } from './data';
import styles from './Footer.module.css';

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Instagram,
  Facebook,
  Linkedin,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand section: logo + org name */}
          <div className={styles.brand}>
            <img
              src="/logo-white.png"
              alt="Instituto de Impacto Social México"
              className={styles.logo}
              loading="lazy"
              width="48"
              height="48"
            />
            <span className={styles.orgName}>
              Instituto de Impacto Social México
            </span>
          </div>

          {/* Links section: email + social */}
          <div className={styles.links}>
            <a
              href={`mailto:${contactEmail}`}
              className={styles.emailLink}
              aria-label={`Enviar correo a ${contactEmail}`}
            >
              <Mail size={18} aria-hidden />
              <span>{contactEmail}</span>
            </a>

            <div className={styles.socialLinks}>
              {socialLinks.map((link) => {
                const IconComponent = iconMap[link.icon];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={link.label}
                  >
                    {IconComponent && <IconComponent size={20} aria-hidden />}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} Instituto de Impacto Social México
          </p>
        </div>
      </div>
    </div>
  );
}
