// src/pages/landing/data.ts
// Static content for the landing page sections

export interface ProgramCard {
  icon: string;        // lucide-react icon name
  title: string;       // max 60 characters
  description: string; // max 120 characters
}

export interface ImpactStat {
  value: string;       // numeric display value (e.g., "500+")
  label: string;       // descriptive label
}

export interface Testimonial {
  projectName: string;
  statistic: string;
  quote: string;       // max 280 characters
  authorName: string;
  authorRole: string;
  image: string;       // path to testimonial photo
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;        // lucide-react icon name
  label: string;
}

export const programas: ProgramCard[] = [
  {
    icon: "Lightbulb",
    title: "Ideación y Modelo de Negocio Social",
    description: "Aprende a transformar ideas en modelos de negocio con impacto social medible y sostenible.",
  },
  {
    icon: "Users",
    title: "Liderazgo y Trabajo en Equipo",
    description: "Desarrolla habilidades de liderazgo colaborativo para dirigir proyectos sociales exitosos.",
  },
  {
    icon: "Rocket",
    title: "Lanzamiento y Escalamiento",
    description: "Lleva tu emprendimiento social del prototipo al mercado con mentoría especializada.",
  },
  {
    icon: "BarChart3",
    title: "Medición de Impacto Social",
    description: "Domina herramientas para medir y comunicar el impacto real de tu proyecto en la comunidad.",
  },
  {
    icon: "GraduationCap",
    title: "Bootcamp de Emprendimiento Social",
    description: "Programa intensivo donde desarrollas tu proyecto social desde la idea hasta el lanzamiento.",
  },
];

export const impactStats: ImpactStat[] = [
  {
    value: "500+",
    label: "Estudiantes formados",
  },
  {
    value: "50+",
    label: "Proyectos sociales lanzados",
  },
  {
    value: "30+",
    label: "Comunidades impactadas",
  },
  {
    value: "15+",
    label: "Mentores especializados",
  },
];

export const testimonials: Testimonial[] = [
  {
    projectName: "Clicks por México",
    statistic: "Más de 20,000 visitas al mes",
    quote:
      "Los videojuegos del mercado no te enseñan nada y muchos tienen contenido violento. Por eso creamos una plataforma de videojuegos educativos que enseña valores y amor por México a niños de primaria.",
    authorName: "Tomás Rocha",
    authorRole: "Fundador de Clicks por México",
    image: "/foto-clicks-por-mexico.png",
  },
  {
    projectName: "Kayam",
    statistic: "Más de 10,000 botellas y envases de plástico no utilizados",
    quote:
      "Elegimos el modelo de emprendimiento social porque siempre creí en la causa del medio ambiente, pero tenía que ser rentable. Queríamos que las personas encontraran productos del día a día que no contaminaran.",
    authorName: "Fundadora de Kayam",
    authorRole: "Emprendedora social",
    image: "/foto-kayam.png",
  },
  {
    projectName: "Pasta Lab",
    statistic: "Talleres de pasta y pizza desde 0",
    quote:
      "Por medio de talleres de cocina inculcamos el valor del servicio y nuevas tradiciones entre familia y amigos.",
    authorName: "Pasta Lab",
    authorRole: "Emprendimiento social gastronómico",
    image: "/pastalab.png",
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/impactosocialmexico",
    icon: "Instagram",
    label: "Síguenos en Instagram",
  },
  {
    platform: "Facebook",
    url: "https://www.facebook.com/impactosocialmexico",
    icon: "Facebook",
    label: "Síguenos en Facebook",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/instituto-de-impacto-social-mexico-791627421/",
    icon: "Linkedin",
    label: "Conéctate en LinkedIn",
  },
];

export const contactEmail = "contacto@impactosocialmexico.org";
