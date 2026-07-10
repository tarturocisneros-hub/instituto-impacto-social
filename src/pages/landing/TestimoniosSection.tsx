import { Quote } from 'lucide-react';
import { testimonials } from './data';
import styles from './TestimoniosSection.module.css';

export default function TestimoniosSection() {
  return (
    <section id="testimonios" className={styles.section} aria-label="Testimonios">
      <div className={styles.container}>
        <h2 className={styles.heading}>Testimonios</h2>

        <div className={styles.grid}>
          {testimonials.map((testimonial) => (
            <article key={testimonial.projectName} className={styles.card}>
              <div className={styles.cardHeader}>
                <img
                  src={testimonial.image}
                  alt={testimonial.projectName}
                  className={styles.testimonialImage}
                  loading="lazy"
                  width="80"
                  height="80"
                />
                <div className={styles.badge}>
                  <span className={styles.projectName}>{testimonial.projectName}</span>
                  <span className={styles.statistic}>{testimonial.statistic}</span>
                </div>
              </div>

              <div className={styles.quoteWrapper}>
                <Quote className={styles.quoteIcon} aria-hidden="true" />
                <blockquote className={styles.quote}>
                  {testimonial.quote}
                </blockquote>
              </div>

              <footer className={styles.author}>
                <span className={styles.authorName}>{testimonial.authorName}</span>
                <span className={styles.authorRole}>{testimonial.authorRole}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
