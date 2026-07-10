# Implementation Plan: Landing Page Integration

## Overview

This plan implements a public-facing landing page at the root URL (/) for Instituto de Impacto Social México and reorganizes all existing webapp routes under /plataforma. The implementation uses React.lazy() code-splitting to keep the landing page independent from authenticated webapp code. Components are built with CSS Modules and lucide-react icons, following existing project conventions.

## Tasks

- [x] 1. Set up route architecture and code-splitting shell
  - [x] 1.1 Create WebappShell component with AuthProvider and nested routes
    - Create `src/WebappShell.tsx` that wraps AuthProvider around all webapp routes
    - Move ProtectedRoute logic into WebappShell
    - All webapp routes use /plataforma prefix (dashboard, projects, projects/new, projects/:id, profile, gamification)
    - Login route at /plataforma/login, Register at /plataforma/register
    - Catch-all inside /plataforma redirects to /plataforma/dashboard
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 9.6_

  - [x] 1.2 Refactor App.tsx with lazy-loaded route boundaries
    - Remove AuthProvider from App.tsx (moved to WebappShell)
    - Add React.lazy() imports for LandingPage and WebappShell
    - Route "/" renders LandingPage in Suspense
    - Route "/plataforma/*" renders WebappShell in Suspense
    - Catch-all route "*" redirects to "/"
    - _Requirements: 1.1, 1.2, 1.7, 9.5_

  - [x] 1.3 Update Layout.tsx navigation links to use /plataforma prefix
    - Change all navItems `to` paths from `/dashboard` to `/plataforma/dashboard`, `/projects` to `/plataforma/projects`, etc.
    - Update `handleSignOut` redirect from `/login` to `/plataforma/login`
    - _Requirements: 1.3_

- [x] 2. Implement landing page structure and static data
  - [x] 2.1 Create landing page data file with static content
    - Create `src/pages/landing/data.ts`
    - Define and export: programas (ProgramCard[]), impactStats (ImpactStat[]), testimonials (Testimonial[]), socialLinks (SocialLink[]), contactEmail
    - Ensure content constraints: card titles ≤ 60 chars, descriptions ≤ 120 chars, testimonial quotes ≤ 280 chars
    - Include both testimonials: Clicks por México and Kayam with their stats, quotes, and founder info
    - _Requirements: 3.2, 3.3, 3.4, 5.2, 5.3_

  - [x] 2.2 Create LandingPage composition component
    - Create `src/pages/landing/LandingPage.tsx` and `LandingPage.module.css`
    - Import and compose all sections in order: Navbar, HeroSection, MisionSection, ProgramasSection, ImpactoSection, TestimoniosSection, FinalCTA, Footer
    - Use semantic HTML: `<header>`, `<nav>` (inside Navbar), `<main>` wrapping sections, `<footer>`
    - Add react-helmet-async `<Helmet>` for SEO meta tags (title, description, og:*, twitter:*, canonical)
    - Wrap each section in an ErrorBoundary with fallback={null}
    - _Requirements: 3.5, 3.6, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 3. Checkpoint - Verify route architecture compiles
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement Hero Section and Navbar
  - [x] 4.1 Create Navbar component with scroll behavior and mobile menu
    - Create `src/pages/landing/Navbar.tsx` and `Navbar.module.css`
    - Fixed position navigation bar with logo and section links (Misión, Programas, Impacto, Testimonios)
    - Include "Iniciar sesión" link to /plataforma/login and "Registrarse" CTA button to /plataforma/register
    - Track scroll position: transparent background when ≤ 100px, solid --primary background when > 100px
    - Mobile (≤ 768px): hamburger menu icon (44×44px tap target), full-screen overlay navigation, close button (44×44px), dismiss within 300ms on close or link click
    - Smooth-scroll to section anchors using scrollIntoView with null-check
    - Use CSS custom properties only (no hardcoded colors)
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 6.2, 6.3, 6.4, 8.1_

  - [x] 4.2 Create HeroSection component
    - Create `src/pages/landing/HeroSection.tsx` and `HeroSection.module.css`
    - Display /logo-white.png with alt text, onError fallback to text
    - Headline ≤ 80 chars, subheadline ≤ 200 chars
    - Primary CTA button "Únete al programa" linking to /plataforma/register
    - Background using --primary (solid or gradient), text contrast ≥ 4.5:1
    - Fully visible in initial viewport on 360px+ width
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 8.1, 8.3_

- [x] 5. Implement content sections
  - [x] 5.1 Create MisionSection component
    - Create `src/pages/landing/MisionSection.tsx` and `MisionSection.module.css`
    - Section heading "Misión" with id anchor for smooth-scroll
    - Max 3 paragraphs, each ≤ 150 words
    - Single-column on mobile, centered content on desktop
    - _Requirements: 3.1, 6.1, 8.1, 8.4_

  - [x] 5.2 Create ProgramasSection component
    - Create `src/pages/landing/ProgramasSection.tsx` and `ProgramasSection.module.css`
    - Section heading "Programas" with id anchor
    - Render program cards from data.ts using lucide-react icons
    - Responsive grid: 1 col ≤ 768px, 2 cols 769–1024px, 3 cols > 1024px
    - Cards use --radius, --shadow-md, spacing from global CSS variables
    - _Requirements: 3.2, 6.1, 6.5, 6.6, 8.1, 8.4, 8.5_

  - [x] 5.3 Create ImpactoSection component
    - Create `src/pages/landing/ImpactoSection.tsx` and `ImpactoSection.module.css`
    - Section heading "Impacto" with id anchor
    - Display numeric stats from data.ts with stat numbers at ≥ 1.5× body font size
    - Descriptive labels below each number
    - _Requirements: 3.3, 8.1, 8.4_

  - [x] 5.4 Create TestimoniosSection component
    - Create `src/pages/landing/TestimoniosSection.tsx` and `TestimoniosSection.module.css`
    - Section heading "Testimonios" with id anchor
    - Render exactly 2 testimonials from data.ts (Clicks por México, Kayam)
    - Each shows: project name, statistic, quote (≤ 280 chars), author name/role
    - _Requirements: 3.4, 8.1, 8.4_

- [x] 6. Implement Final CTA and Footer
  - [x] 6.1 Create FinalCTA component
    - Create `src/pages/landing/FinalCTA.tsx` and `FinalCTA.module.css`
    - Headline ≤ 80 chars, supporting text ≤ 200 chars
    - CTA button navigating to /plataforma/register
    - Use --primary or --secondary background for visual contrast
    - _Requirements: 4.4, 8.1_

  - [x] 6.2 Create Footer component
    - Create `src/pages/landing/Footer.tsx` and `Footer.module.css`
    - Display /logo-white.png and org name in white (#ffffff via --white)
    - Contact email as mailto: link
    - Social media links from data.ts rendered as icon links with target="_blank" and rel="noopener noreferrer"
    - Copyright notice with dynamic current year: "© {year} Instituto de Impacto Social México"
    - Background: --primary-dark
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 8.1, 8.3_

- [x] 7. Checkpoint - Verify landing page renders correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. SEO, PWA, and build configuration
  - [x] 8.1 Install react-helmet-async and configure HelmetProvider
    - Install react-helmet-async dependency
    - Wrap App component in HelmetProvider in main.tsx
    - Set `lang="es"` on the HTML element in index.html
    - _Requirements: 7.7, 7.8_

  - [x] 8.2 Update index.html with base meta tags
    - Add meta description (150–160 chars) referencing the organization and social entrepreneurship for youth
    - Add Open Graph tags: og:title, og:description, og:image (≥1200×630px), og:url, og:type="website"
    - Add Twitter Card tags: twitter:card="summary_large_image", twitter:title, twitter:description, twitter:image
    - Add canonical link to https://www.impactosocialmexico.org/
    - Ensure lang="es" on html element
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 9.4_

  - [x] 8.3 Update PWA manifest and Vite config for code-splitting
    - Set manifest start_url to "/plataforma/dashboard"
    - Keep manifest scope as "/"
    - Add Vite manualChunks config to split landing page code from webapp code
    - Ensure production build outputs single dist/ directory serving all routes as SPA
    - _Requirements: 9.1, 9.2, 9.3, 10.4_

- [x] 9. Responsive design and performance polish
  - [x] 9.1 Implement responsive CSS for all landing sections
    - Ensure single-column layout at ≤ 768px for all sections
    - Minimum text size of 16px on mobile
    - All images scale within containers without overflow (320px–1920px)
    - Verify 44×44px tap targets for interactive elements on mobile
    - _Requirements: 6.1, 6.7, 6.8, 8.4_

  - [x] 9.2 Add lazy-loading and image optimization
    - Apply loading="lazy" to images below the initial viewport fold
    - Set explicit width/height or aspect-ratio on image containers for layout stability
    - Add placeholder styling for failed lazy-loaded images
    - _Requirements: 10.2, 10.5_

- [x] 10. Final checkpoint - Verify complete integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 11. Write unit tests for routing and components
  - [ ]* 11.1 Write route mapping tests
    - Test that "/" renders LandingPage
    - Test that "/plataforma/dashboard" requires auth and redirects to /plataforma/login when unauthenticated
    - Test that "/plataforma/login" renders Login
    - Test catch-all redirects to "/"
    - Use MemoryRouter for isolated route testing
    - _Requirements: 1.1, 1.2, 1.6, 1.7_

  - [ ]* 11.2 Write landing page component tests
    - Test semantic HTML structure (1 header, 1 nav, 1 main, 1 footer)
    - Test CTA button links point to /plataforma/register
    - Test logo fallback text on image error
    - Test copyright year is dynamic
    - Test content length constraints (headline ≤ 80 chars, etc.)
    - _Requirements: 2.1, 2.2, 2.4, 2.7, 5.4, 7.5_

  - [ ]* 11.3 Write navbar behavior tests
    - Test scroll-based background change (transparent ≤ 100px, solid > 100px)
    - Test hamburger menu opens and closes overlay on mobile
    - Test navigation links trigger smooth scroll
    - _Requirements: 4.5, 4.6, 6.2, 6.3, 6.4_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The design explicitly states property-based testing is not applicable (static content, finite routes, viewport-dependent behavior)
- Unit tests use Vitest + React Testing Library with jsdom environment
- react-helmet-async is the only new dependency needed
- All CSS must use CSS Modules (*.module.css) and reference global CSS custom properties only

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.2", "4.1", "4.2"] },
    { "id": 3, "tasks": ["5.1", "5.2", "5.3", "5.4"] },
    { "id": 4, "tasks": ["6.1", "6.2"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3"] },
    { "id": 6, "tasks": ["9.1", "9.2"] },
    { "id": 7, "tasks": ["11.1", "11.2", "11.3"] }
  ]
}
```
