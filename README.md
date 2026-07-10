# Instituto de Impacto Social México - PWA

Plataforma web progresiva (PWA) para el registro y seguimiento de proyectos de emprendimiento social en México.

## 🚀 Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **PWA:** vite-plugin-pwa (Service Worker, Offline Support)
- **Estilos:** CSS Modules (sin frameworks externos)
- **Iconos:** Lucide React
- **Routing:** React Router DOM v7

## 📋 Funcionalidades

### Registro de Proyectos
- Formulario multi-paso (4 pasos)
- Categorías: Educación, Salud, Medio Ambiente, Tecnología Social, etc.
- Vinculación con Objetivos de Desarrollo Sostenible (ODS)
- Ubicación por estado/ciudad de México

### Sistema de Gamificación
- Puntos por acciones (registrar proyecto, seguimiento, completar hitos)
- 5 niveles de usuario: Explorador → Iniciador → Impulsor → Transformador → Líder de Impacto
- 4 niveles de proyecto: Semilla → Brote → Árbol → Bosque
- Insignias desbloqueables

### Módulo de Retención y Seguimiento
- Registro de avances, notas, problemas y logros
- Timeline cronológico de actividades
- Hitos del proyecto con fecha límite
- Barra de progreso con actualización manual

### Autenticación
- Registro e inicio de sesión con email/contraseña
- Perfiles de usuario editables
- Row Level Security (RLS) en Supabase

## 🛠️ Configuración

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En SQL Editor, ejecuta el script `supabase/schema.sql`
3. Copia tu Project URL y anon key

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```
Edita `.env` con tus credenciales de Supabase:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Build para producción
```bash
npm run build
```

## 📱 PWA

La aplicación funciona como Progressive Web App:
- Instalable en dispositivos móviles y escritorio
- Soporte offline básico con caching de assets
- Manifest personalizado con branding del Instituto

## 🗄️ Estructura de Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Perfiles de usuario (nombre, rol, puntos, nivel) |
| `projects` | Proyectos de emprendimiento social |
| `milestones` | Hitos por proyecto |
| `badges` | Insignias disponibles |
| `user_badges` | Insignias ganadas por usuario |
| `follow_ups` | Registros de seguimiento |

## 🏗️ Estructura del Proyecto

```
src/
├── components/      # Layout y componentes compartidos
├── context/         # AuthContext (autenticación global)
├── lib/             # Cliente Supabase
├── pages/           # Páginas de la app
├── styles/          # Estilos globales
└── types/           # TypeScript interfaces
```

## 📄 Licencia

Instituto de Impacto Social México © 2026
