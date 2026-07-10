import styles from './MisionSection.module.css';

export default function MisionSection() {
  return (
    <section id="mision" className={styles.section} aria-labelledby="mision-heading">
      <div className={styles.container}>
        <h2 id="mision-heading" className={styles.heading}>
          Misión
        </h2>

        <div className={styles.content}>
          <p className={styles.paragraph}>
            El Instituto de Impacto Social México forma a jóvenes de 18 a 35 años
            en emprendimiento social, brindándoles las herramientas, mentoría y comunidad necesarias
            para diseñar, lanzar y escalar negocios que generen un impacto positivo y medible en
            sus comunidades.
          </p>

          <p className={styles.paragraph}>
            Creemos que la juventud mexicana tiene el talento y la pasión para resolver los retos
            sociales más urgentes del país. Nuestro programa conecta la energía de los estudiantes
            con metodologías probadas de innovación social, creando emprendedores capaces de
            construir empresas rentables con propósito.
          </p>

          <p className={styles.paragraph}>
            A través de capacitación práctica, acompañamiento personalizado y una red de mentores
            expertos, transformamos ideas en proyectos reales que mejoran la vida de miles de
            personas en comunidades de todo México.
          </p>
        </div>
      </div>
    </section>
  );
}
