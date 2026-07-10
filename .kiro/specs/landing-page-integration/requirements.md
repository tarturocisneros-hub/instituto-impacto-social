# Requirements Document

## Introduction

This feature adds a professional, public-facing landing page for "Instituto de Impacto Social México" at the root URL (/) of the domain www.impactosocialmexico.org. The landing page communicates the organization's mission, programs, and value proposition to prospective participants (university students aged 18–25). The existing webapp (registration, login, dashboard, projects, gamification, profile) is reorganized under the sub-path /plataforma so that the public landing page and the authenticated application coexist within the same React + Vite deployment.

## Glossary

- **Landing_Page**: The public-facing, unauthenticated marketing page rendered at the root URL (/) that presents the organization's brand, mission, programs, and calls-to-action.
- **Webapp**: The existing authenticated application comprising login, registration, dashboard, projects, gamification, and profile pages.
- **Router**: The React Router DOM instance responsible for mapping URL paths to rendered components.
- **Hero_Section**: The first visible section of the Landing_Page containing the main headline, subheadline, and primary call-to-action button.
- **CTA_Button**: A call-to-action element that navigates the visitor to the Webapp registration page.
- **SEO_Metadata**: HTML meta tags (title, description, Open Graph, Twitter Card) embedded in the document head to improve search engine indexing and social sharing previews.
- **Viewport**: The visible area of the web page within the user's browser window, varying by device screen size.
- **Breakpoint**: A CSS media query threshold at which the layout adapts to different Viewport widths (mobile ≤ 768px, tablet ≤ 1024px, desktop > 1024px).
- **PWA_Manifest**: The web app manifest JSON file that configures progressive web app behavior (icons, start URL, display mode).

## Requirements

### Requirement 1: Landing Page Route Configuration

**User Story:** As a visitor, I want to see a professional landing page when I navigate to the root URL, so that I can learn about the organization before deciding to register.

#### Acceptance Criteria

1. WHEN a visitor navigates to the root URL (/), THE Router SHALL render the Landing_Page component.
2. WHEN an authenticated user navigates to the root URL (/), THE Router SHALL render the Landing_Page component without automatic redirection to the Webapp.
3. THE Router SHALL serve all existing Webapp routes under the /plataforma base path, including: /plataforma/dashboard, /plataforma/projects, /plataforma/projects/new, /plataforma/projects/:id, /plataforma/profile, and /plataforma/gamification.
4. WHEN a visitor navigates to /plataforma/login, THE Router SHALL render the Login page.
5. WHEN a visitor navigates to /plataforma/register, THE Router SHALL render the Register page.
6. WHEN an unauthenticated visitor navigates to any /plataforma route other than /plataforma/login or /plataforma/register, THE Router SHALL redirect the visitor to /plataforma/login.
7. WHEN a visitor navigates to a URL that does not match the root URL (/) or any defined /plataforma route, THE Router SHALL redirect the visitor to the root URL (/).

### Requirement 2: Landing Page Hero Section

**User Story:** As a visitor, I want to immediately understand the organization's purpose when I arrive at the site, so that I can determine if the program is relevant to me.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the organization logo sourced from /logo-white.png with alt text "Instituto de Impacto Social México".
2. THE Hero_Section SHALL display a headline of no more than 80 characters that states what the organization does and who it serves.
3. THE Hero_Section SHALL display a subheadline of no more than 200 characters that summarizes the target audience and program benefit.
4. THE Hero_Section SHALL contain a primary CTA_Button with the text "Únete al programa" that navigates to /plataforma/register.
5. THE Hero_Section SHALL render a background using the organization's primary brand color (#1e3a5f) as a solid fill or as the dominant color in a linear gradient where all colors maintain a contrast ratio of at least 4.5:1 against foreground text.
6. THE Hero_Section SHALL be fully visible within the initial viewport without scrolling on viewports of 360px width or larger.
7. IF the logo image at /logo-white.png fails to load, THEN THE Hero_Section SHALL display the organization name "Instituto de Impacto Social México" as text in place of the image.

### Requirement 3: Landing Page Content Sections

**User Story:** As a visitor, I want to read about the organization's mission, programs, and impact, so that I can evaluate whether to participate.

#### Acceptance Criteria

1. THE Landing_Page SHALL include a "Misión" section with a visible section heading and a description of the organization's purpose in a maximum of 3 paragraphs, each paragraph containing no more than 150 words.
2. THE Landing_Page SHALL include a "Programas" section that presents at least 3 training offerings using card-based layouts, where each card contains an icon, a title of no more than 60 characters, and a description of no more than 120 characters.
3. THE Landing_Page SHALL include an "Impacto" section that displays at least 3 numeric statistics, each accompanied by a descriptive label (e.g., "Estudiantes formados", "Proyectos lanzados", "Comunidades impactadas"), where each number is rendered at a font size at least 1.5 times larger than the section body text.
4. THE Landing_Page SHALL include a "Testimonios" section that displays exactly 2 testimonial entries:
   - **Clicks por México**: Plataforma de videojuegos educativos que enseña valores y amor por México a niños de primaria. Estadística destacada: más de 20,000 visitas al mes. The testimonial SHALL include the project name, the statistic, a brief quote about how the Instituto helped them develop their social enterprise, and the founder's name/role.
   - **Kayam**: Tienda ecológica de productos naturales y ecológicos para el cuidado de la piel, hechos por productores 100% mexicanos. Estadística destacada: más de 10,000 botellas y envases de plástico no utilizados. The testimonial SHALL include the project name, the statistic, a brief quote about their experience with the Instituto's programs, and the founder's name/role.
   Each testimonial entry SHALL contain a maximum of 280 characters of quote text, with the author's name and role displayed below the quote.
5. THE Landing_Page SHALL arrange sections in the following order: Hero_Section, Misión, Programas, Impacto, Testimonios, Final CTA, Footer.
6. IF the Landing_Page content fails to load for any section, THEN THE Landing_Page SHALL still render the remaining sections without layout breakage.

### Requirement 4: Landing Page Call-to-Action and Navigation

**User Story:** As a visitor, I want clear paths to register or learn more, so that I can take action after reading about the organization.

#### Acceptance Criteria

1. THE Landing_Page SHALL include a fixed navigation bar at the top that contains the organization logo and navigation links to each Landing_Page section (Misión, Programas, Impacto, Testimonios), where clicking a link triggers smooth-scroll behavior to the corresponding section anchor.
2. THE Landing_Page navigation bar SHALL include a "Iniciar sesión" link that navigates to /plataforma/login.
3. THE Landing_Page navigation bar SHALL include a "Registrarse" button styled as a CTA_Button that navigates to /plataforma/register.
4. THE Landing_Page SHALL include a final CTA section before the Footer with a headline of no more than 80 characters, supporting text of no more than 200 characters, and a CTA_Button that navigates to /plataforma/register.
5. WHILE the visitor scroll position is at or below 100px from the top, THE Landing_Page navigation bar SHALL display a transparent background.
6. WHEN a visitor scrolls down more than 100px from the top, THE Landing_Page navigation bar SHALL display the organization's primary brand color (#1e3a5f) as a solid background.

### Requirement 5: Landing Page Footer

**User Story:** As a visitor, I want to find contact information and social links, so that I can reach the organization through other channels.

#### Acceptance Criteria

1. THE Footer SHALL display the organization logo sourced from /logo-white.png and the organization name "Instituto de Impacto Social México" with text rendered in white (#ffffff) for contrast against the dark background.
2. THE Footer SHALL include a contact email address displayed as a clickable mailto: link.
3. WHERE social media profile URLs are configured, THE Footer SHALL render each profile as a labeled icon link that opens in a new browser tab.
4. THE Footer SHALL display a copyright notice containing the dynamically generated current year and the organization name in the format "© [year] Instituto de Impacto Social México".
5. THE Footer SHALL use the organization's primary dark color (#0f1f33) as background.
6. WHEN a visitor activates a social media link, THE Footer SHALL open the target URL in a new browser tab without navigating away from the Landing_Page.

### Requirement 6: Responsive Design

**User Story:** As a mobile user, I want the landing page to be fully usable on my device, so that I can learn about the organization regardless of my screen size.

#### Acceptance Criteria

1. WHILE the Viewport width is equal to or less than 768px, THE Landing_Page SHALL display a single-column layout for all content sections.
2. WHILE the Viewport width is equal to or less than 768px, THE Landing_Page navigation bar SHALL collapse navigation links into a hamburger menu icon with a minimum tap target size of 44×44px.
3. WHEN a visitor taps the hamburger menu icon, THE Landing_Page SHALL display a full-screen overlay navigation menu with a visible close button (minimum 44×44px tap target).
4. WHEN a visitor taps the close button or a navigation link within the overlay menu, THE Landing_Page SHALL dismiss the full-screen overlay navigation menu within 300ms.
5. WHILE the Viewport width is greater than 768px and equal to or less than 1024px, THE Landing_Page SHALL display a two-column grid for the "Programas" section cards.
6. WHILE the Viewport width is greater than 1024px, THE Landing_Page SHALL display a three-column grid for the "Programas" section cards.
7. WHILE the Viewport width is equal to or less than 768px, THE Landing_Page SHALL render all text at a minimum computed size of 16px.
8. THE Landing_Page SHALL ensure that all images and media elements scale to fit within their parent container without horizontal overflow at any viewport width from 320px to 1920px.

### Requirement 7: SEO and Metadata

**User Story:** As the organization, I want the landing page to be indexed correctly by search engines and display rich previews on social media, so that the page attracts organic traffic.

#### Acceptance Criteria

1. THE Landing_Page SHALL set the HTML document title to "Instituto de Impacto Social México – Emprendimiento Social para Jóvenes".
2. THE Landing_Page SHALL include a meta description tag between 150 and 160 characters (inclusive) that contains the organization name and a reference to social entrepreneurship for youth.
3. THE Landing_Page SHALL include Open Graph meta tags with the following properties: og:title (matching the document title), og:description (matching the meta description content), og:image (referencing an image of at least 1200×630 pixels), og:url (set to the canonical URL), and og:type (set to "website").
4. THE Landing_Page SHALL include Twitter Card meta tags with the following properties: twitter:card (set to "summary_large_image"), twitter:title (matching the document title), twitter:description (matching the meta description content), and twitter:image (referencing the same image as og:image).
5. THE Landing_Page SHALL structure its content using semantic HTML elements where the page contains exactly one `<header>`, one `<nav>`, one `<main>`, at least one `<section>` within `<main>`, and one `<footer>`.
6. THE Landing_Page SHALL include a canonical URL meta tag pointing to https://www.impactosocialmexico.org/.
7. THE Landing_Page SHALL set the `lang` attribute on the `<html>` element to "es" to indicate the primary language of the content to search engines.
8. THE Landing_Page SHALL be entirely in Spanish (es-MX). All visible text, labels, navigation items, CTAs, and metadata SHALL be written in Spanish.

### Requirement 8: Branding and Visual Consistency

**User Story:** As the organization, I want the landing page to reflect our established visual identity, so that visitors experience a cohesive brand across all touchpoints.

#### Acceptance Criteria

1. THE Landing_Page SHALL reference colors exclusively through the CSS custom properties defined in the global stylesheet (:root variables), including --primary (#1e3a5f), --secondary (#e8833a), --accent (#27ae60), and their associated light/dark variants, without hardcoding hex values in component styles.
2. THE Landing_Page SHALL use the font family declared in the global stylesheet body rule ('Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif) for all text elements, inheriting from the global declaration without overriding it.
3. THE Landing_Page SHALL display /logo-white.png in sections where the background color is --primary or --primary-dark, and SHALL display /logo.png in sections where the background color is --white, --gray-50, or --gray-100.
4. THE Landing_Page CSS SHALL be implemented using CSS Modules with the *.module.css file naming convention and imported as scoped style objects in corresponding component files, matching the pattern used in existing components.
5. THE Landing_Page SHALL use the existing CSS custom properties for spacing (border-radius: --radius-sm, --radius, --radius-lg, --radius-xl) and elevation (box-shadow: --shadow-sm, --shadow, --shadow-md, --shadow-lg) defined in the global stylesheet, without introducing new shadow or radius values.

### Requirement 9: PWA and Deployment Configuration

**User Story:** As a developer, I want the deployment configuration to support both the landing page and the webapp under the same domain, so that users have a seamless experience.

#### Acceptance Criteria

1. THE PWA_Manifest SHALL set the start_url to /plataforma/dashboard to maintain the existing PWA behavior for authenticated users.
2. THE PWA_Manifest SHALL set the scope to / to allow service worker control over both the Landing_Page and Webapp routes.
3. WHEN deploying to production, THE Vite configuration SHALL produce a single output directory (dist/) that serves both the Landing_Page routes and the Webapp routes (/plataforma/*) as a client-side SPA with all paths resolving to index.html.
4. THE index.html SHALL include a meta description referencing the Landing_Page purpose (institutional description and value proposition) and set the og:url meta tag to the root domain URL.
5. IF a visitor navigates to an undefined route outside of /plataforma, THEN THE Router SHALL redirect the visitor to the Landing_Page (/).
6. IF a visitor navigates to an undefined route within /plataforma, THEN THE Router SHALL redirect the visitor to /plataforma/dashboard.

### Requirement 10: Performance

**User Story:** As a visitor on a slow connection, I want the landing page to load quickly, so that I do not abandon the page before it renders.

#### Acceptance Criteria

1. THE Landing_Page SHALL achieve a Largest Contentful Paint (LCP) time of 2.5 seconds or less when measured using Lighthouse with a simulated throttling profile of 1.6 Mbps download, 750 Kbps upload, and 150 ms RTT (Slow 4G preset).
2. THE Landing_Page SHALL lazy-load images that are positioned below the initial viewport fold (based on a 1366×768 reference viewport) using the native loading="lazy" attribute.
3. THE Landing_Page SHALL not import Webapp-specific code (Supabase client, authenticated components), and its initial JavaScript bundle chunk SHALL not exceed 150 KB gzipped.
4. WHEN the Landing_Page is built for production, THE Vite configuration SHALL produce a separate code chunk for Landing_Page assets distinct from Webapp assets.
5. IF a lazy-loaded image fails to load, THEN THE Landing_Page SHALL display a placeholder area matching the image's declared dimensions so that page layout is not shifted.
