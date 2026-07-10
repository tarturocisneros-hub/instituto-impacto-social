-- =============================================================
-- Instituto de Impacto Social México
-- Esquema PostgreSQL para Supabase
-- =============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- TABLA: profiles
-- Perfiles de usuario vinculados a auth.users
-- =============================================================
CREATE TABLE public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  role TEXT NOT NULL DEFAULT 'emprendedor' CHECK (role IN ('emprendedor', 'mentor', 'admin')),
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- TABLA: projects
-- Proyectos de emprendimiento social
-- =============================================================
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'educacion', 'salud', 'medio_ambiente', 'tecnologia_social',
    'economia_solidaria', 'cultura', 'derechos_humanos', 'desarrollo_comunitario'
  )),
  status TEXT NOT NULL DEFAULT 'borrador' CHECK (status IN (
    'borrador', 'en_revision', 'aprobado', 'en_progreso', 'completado', 'pausado'
  )),
  impact_area TEXT NOT NULL,
  target_beneficiaries TEXT NOT NULL,
  estimated_beneficiaries INTEGER NOT NULL DEFAULT 0,
  location_state TEXT NOT NULL,
  location_city TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  budget_estimated NUMERIC,
  team_size INTEGER NOT NULL DEFAULT 1,
  ods_goals INTEGER[] DEFAULT '{}',
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  level TEXT NOT NULL DEFAULT 'semilla' CHECK (level IN ('semilla', 'brote', 'arbol', 'bosque')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Índices para búsquedas frecuentes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_category ON public.projects(category);

-- =============================================================
-- TABLA: milestones
-- Hitos de los proyectos
-- =============================================================
CREATE TABLE public.milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  points_awarded INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_milestones_project_id ON public.milestones(project_id);

-- =============================================================
-- TABLA: badges
-- Insignias disponibles en el sistema
-- =============================================================
CREATE TABLE public.badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('proyecto', 'comunidad', 'impacto', 'constancia')),
  points_required INTEGER NOT NULL DEFAULT 0
);

-- Insertar insignias iniciales
INSERT INTO public.badges (name, description, icon, category, points_required) VALUES
  ('Primer Paso', 'Registra tu primer proyecto', '🌱', 'proyecto', 0),
  ('Explorador Social', 'Registra 3 proyectos', '🧭', 'proyecto', 30),
  ('Constancia', '7 días consecutivos de actividad', '🔥', 'constancia', 50),
  ('Impacto Comunitario', 'Alcanza 100 beneficiarios', '🤝', 'impacto', 100),
  ('Líder Verde', 'Completa un proyecto medioambiental', '🌿', 'proyecto', 50),
  ('Estrella Social', 'Alcanza 500 puntos', '⭐', 'impacto', 500),
  ('Mentor', 'Ayuda a 3 emprendedores', '🎓', 'comunidad', 200),
  ('Innovador', 'Proyecto de tecnología social aprobado', '💡', 'proyecto', 75);

-- =============================================================
-- TABLA: user_badges
-- Insignias ganadas por usuarios
-- =============================================================
CREATE TABLE public.user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);

-- =============================================================
-- TABLA: follow_ups
-- Seguimiento y retención de proyectos
-- =============================================================
CREATE TABLE public.follow_ups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('nota', 'avance', 'problema', 'logro')),
  content TEXT NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_follow_ups_project_id ON public.follow_ups(project_id);
CREATE INDEX idx_follow_ups_user_id ON public.follow_ups(user_id);

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies para projects
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Policies para milestones (via project ownership)
CREATE POLICY "Users can manage milestones of own projects"
  ON public.milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = milestones.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Policies para badges (everyone can view)
CREATE POLICY "Everyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

-- Policies para user_badges
CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies para follow_ups
CREATE POLICY "Users can view follow_ups of own projects"
  ON public.follow_ups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = follow_ups.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert follow_ups for own projects"
  ON public.follow_ups FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = follow_ups.project_id
      AND projects.user_id = auth.uid()
    )
  );
