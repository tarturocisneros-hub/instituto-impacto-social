-- =============================================================
-- Migration: Learning Missions System
-- Instituto de Impacto Social México
-- =============================================================

-- =============================================================
-- 1.1: TABLA mission_templates
-- Plantillas predefinidas de misiones de aprendizaje
-- =============================================================
CREATE TABLE public.mission_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  lesson_content TEXT NOT NULL,
  suggested_order INTEGER NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 1.2: TABLA learning_missions
-- Instancias de misiones asignadas a proyectos
-- =============================================================
CREATE TABLE public.learning_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  mission_template_id UUID NOT NULL REFERENCES public.mission_templates(id),
  reflection TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 1.3: Índices y restricción de unicidad
-- =============================================================
CREATE INDEX idx_learning_missions_project_id ON public.learning_missions(project_id);
ALTER TABLE public.learning_missions ADD CONSTRAINT unique_project_mission UNIQUE (project_id, mission_template_id);

-- =============================================================
-- 1.4: RLS para mission_templates
-- Todos los autenticados pueden leer; solo admin puede modificar
-- =============================================================
ALTER TABLE public.mission_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read templates"
ON public.mission_templates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can insert templates"
ON public.mission_templates FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin can update templates"
ON public.mission_templates FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin can delete templates"
ON public.mission_templates FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- =============================================================
-- 1.5: RLS para learning_missions
-- Solo el dueño del proyecto puede ver y actualizar sus misiones
-- =============================================================
ALTER TABLE public.learning_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owner can view own missions"
ON public.learning_missions FOR SELECT
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project owner can update own missions"
ON public.learning_missions FOR UPDATE
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);

-- =============================================================
-- 1.6: Trigger function assign_missions_to_project()
-- Asigna una learning_mission por cada template activo al crear proyecto
-- =============================================================
CREATE OR REPLACE FUNCTION assign_missions_to_project()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.learning_missions (project_id, mission_template_id)
  SELECT NEW.id, mt.id
  FROM public.mission_templates mt
  WHERE mt.is_active = true;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't block project creation
  RAISE WARNING 'Failed to assign missions to project %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- 1.7: Trigger trg_assign_missions
-- Se ejecuta después de insertar un nuevo proyecto
-- =============================================================
CREATE TRIGGER trg_assign_missions
AFTER INSERT ON public.projects
FOR EACH ROW
EXECUTE FUNCTION assign_missions_to_project();

-- =============================================================
-- 1.8: RPC function complete_mission
-- Valida reflexión, marca misión completa, otorga puntos,
-- recalcula progreso y nivel del proyecto
-- =============================================================
CREATE OR REPLACE FUNCTION complete_mission(
  p_mission_id UUID,
  p_reflection TEXT
) RETURNS VOID AS $$
DECLARE
  v_project_id UUID;
  v_points INTEGER;
  v_user_id UUID;
  v_total_missions INTEGER;
  v_completed_missions INTEGER;
  v_progress INTEGER;
  v_level TEXT;
BEGIN
  -- Validate reflection length
  IF LENGTH(p_reflection) < 50 THEN
    RAISE EXCEPTION 'Reflection must be at least 50 characters';
  END IF;

  -- Get mission details and verify not already completed
  SELECT lm.project_id, mt.points_awarded
  INTO v_project_id, v_points
  FROM public.learning_missions lm
  JOIN public.mission_templates mt ON mt.id = lm.mission_template_id
  WHERE lm.id = p_mission_id AND lm.completed = false;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mission not found or already completed';
  END IF;

  -- Get project owner
  SELECT user_id INTO v_user_id FROM public.projects WHERE id = v_project_id;

  -- Mark mission complete
  UPDATE public.learning_missions
  SET reflection = p_reflection,
      completed = true,
      completed_at = NOW()
  WHERE id = p_mission_id;

  -- Award points
  UPDATE public.profiles
  SET points = points + v_points
  WHERE user_id = v_user_id;

  -- Recalculate progress
  SELECT COUNT(*), COUNT(*) FILTER (WHERE completed = true)
  INTO v_total_missions, v_completed_missions
  FROM public.learning_missions
  WHERE project_id = v_project_id;

  v_progress := ROUND((v_completed_missions::NUMERIC / v_total_missions) * 100);

  -- Determine level
  v_level := CASE
    WHEN v_progress >= 75 THEN 'bosque'
    WHEN v_progress >= 50 THEN 'arbol'
    WHEN v_progress >= 25 THEN 'brote'
    ELSE 'semilla'
  END;

  -- Update project progress and level
  UPDATE public.projects
  SET progress_percentage = v_progress,
      level = v_level
  WHERE id = v_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================================
-- 1.9: Seed Data - 8 misiones de aprendizaje en español (es-MX)
-- =============================================================
INSERT INTO public.mission_templates (title, lesson_content, suggested_order, points_awarded) VALUES

(
  'Identifica el problema social que resuelves',
  'Todo emprendimiento social exitoso comienza con una comprensión profunda del problema que busca resolver. No basta con tener una intuición; necesitas investigar, observar y documentar la problemática social que te motiva. Pregúntate: ¿a quién afecta este problema? ¿Cuántas personas lo padecen en tu comunidad? ¿Cuáles son las causas raíz y no solo los síntomas?

Para identificar correctamente tu problema social, te recomendamos usar la técnica de los "5 por qués": ante cada respuesta, pregunta nuevamente "¿por qué?" hasta llegar a la causa fundamental. También es valioso hablar directamente con las personas afectadas y escuchar sus experiencias en primera persona.

Recuerda que un problema bien definido es la mitad de la solución. Tu reflexión debe describir con claridad el problema social específico que tu emprendimiento busca resolver, incluyendo a quién afecta y por qué es importante atenderlo.',
  1,
  15
),

(
  'Define tu propuesta de valor social',
  'La propuesta de valor social es lo que hace único a tu emprendimiento. Es la promesa de transformación que ofreces a tus beneficiarios y lo que te distingue de otras organizaciones que atienden la misma problemática. Una buena propuesta de valor responde a: ¿qué cambio concreto generas? ¿Cómo lo logras de manera diferente o mejor que las alternativas existentes?

Para construir tu propuesta de valor social, considera tres elementos clave: el beneficio tangible que entregas (qué mejora en la vida de tus beneficiarios), tu enfoque diferenciador (cómo lo haces de forma única) y la evidencia de que funciona (qué indicadores muestran tu impacto).

Reflexiona sobre cómo tu solución atiende directamente las causas del problema que identificaste. No se trata solo de aliviar síntomas, sino de generar un cambio sostenible. Tu propuesta de valor debe ser clara, concisa y comunicable en una o dos oraciones.',
  2,
  15
),

(
  'Mapea a tus beneficiarios directos',
  'Conocer a fondo a tus beneficiarios es esencial para diseñar soluciones que realmente funcionen. Un mapa de beneficiarios va más allá de describir a "personas vulnerables"; necesitas entender sus características demográficas, sus necesidades específicas, sus motivaciones, sus barreras y el contexto en el que viven.

Crea un perfil detallado de tu beneficiario ideal: ¿Qué edad tiene? ¿Dónde vive? ¿Cuál es su situación económica? ¿Qué ha intentado antes para resolver su problema? ¿Qué barreras enfrenta para acceder a soluciones existentes? Además, identifica a los beneficiarios indirectos: familias, comunidades y otros actores que se benefician cuando tu población objetivo mejora su situación.

El mapeo de beneficiarios te permitirá personalizar tu solución, comunicarte de manera efectiva y medir tu impacto con mayor precisión. Reflexiona sobre quiénes son las personas concretas a las que sirves y cómo tu conocimiento de ellas influye en el diseño de tu emprendimiento.',
  3,
  15
),

(
  'Diseña tu modelo de ingresos sostenible',
  'Un emprendimiento social necesita ser financieramente sostenible para generar impacto a largo plazo. Tu modelo de ingresos describe cómo generarás los recursos necesarios para operar y crecer sin depender indefinidamente de donaciones o subsidios. Existen múltiples modelos: venta de productos o servicios, modelos freemium, subsidios cruzados, licenciamiento, entre otros.

Analiza estas preguntas: ¿Quién puede pagar por tu solución? ¿Puedes tener un cliente que pague y un beneficiario que reciba el servicio gratuitamente? ¿Qué costos fijos y variables tienes? ¿Cuántas unidades necesitas vender o cuántos clientes necesitas para cubrir tus costos operativos? Un modelo de ingresos sostenible no significa maximizar ganancias, sino asegurar que tu impacto pueda continuar y escalar.

Reflexiona sobre las fuentes de ingreso realistas para tu emprendimiento. Describe al menos dos posibles fuentes de financiamiento y explica cómo cada una contribuye a la sostenibilidad de tu misión social.',
  4,
  15
),

(
  'Valida tu idea con 5 personas reales',
  'La validación temprana es uno de los pasos más importantes y frecuentemente ignorados por emprendedores sociales. Antes de invertir meses de trabajo en desarrollar tu solución completa, necesitas confirmar que tu propuesta realmente resuena con las personas que pretendes ayudar. La meta mínima es conversar con 5 personas reales de tu población objetivo.

Durante estas conversaciones de validación, evita preguntas que sugieran la respuesta que quieres escuchar. En lugar de preguntar "¿Te gustaría un servicio que haga X?", pregunta "¿Cómo lidias actualmente con este problema?" y "¿Qué has intentado antes?". Escucha más de lo que hablas y toma notas detalladas de sus respuestas, emociones y lenguaje corporal.

Documenta los hallazgos de tus cinco conversaciones. En tu reflexión, comparte qué aprendiste que no sabías, qué suposiciones se confirmaron, cuáles se invalidaron y cómo ajustarás tu propuesta basándote en esta retroalimentación directa.',
  5,
  15
),

(
  'Crea tu primer prototipo o MVP',
  'Un Producto Mínimo Viable (MVP) es la versión más simple de tu solución que te permite aprender si funciona con el menor esfuerzo posible. No necesita ser perfecto ni completo; necesita ser suficiente para probar tu hipótesis principal. Para un emprendimiento social, tu MVP puede ser un taller piloto, un servicio manual antes de automatizarlo, una landing page, o incluso un proceso en papel.

La clave del MVP es definir claramente qué hipótesis estás probando. Por ejemplo: "Si ofrecemos talleres de educación financiera a madres solteras los sábados por la mañana, al menos 10 de 15 invitadas asistirán". Tu MVP debe ser medible, tener un criterio de éxito definido y un plazo corto de implementación (idealmente 2-4 semanas).

Describe tu primer prototipo o MVP: ¿Qué forma tomará? ¿Qué hipótesis estás probando? ¿Cuál será tu criterio de éxito? ¿En qué plazo lo implementarás? Recuerda que lanzar algo imperfecto es mejor que planear algo perfecto que nunca se materializa.',
  6,
  15
),

(
  'Mide tu impacto social inicial',
  'Medir el impacto social es lo que distingue a un emprendimiento social de una buena intención. Sin medición, no puedes saber si realmente estás generando el cambio que prometes. La medición de impacto no tiene que ser compleja al inicio, pero sí debe ser intencional y consistente.

Define tus indicadores en tres niveles: outputs (actividades realizadas, como "20 talleres impartidos"), outcomes (cambios a corto plazo, como "80% de participantes aplican lo aprendido") e impact (cambio a largo plazo, como "reducción del 30% en morosidad de los participantes"). Al inicio, enfócate en medir outputs y al menos un outcome claro.

Establece tu línea base: ¿cuál es la situación actual de tus beneficiarios antes de tu intervención? Define al menos 3 indicadores que medirás regularmente y explica cómo recopilarás esos datos. Tu reflexión debe incluir qué indicadores elegiste, por qué son relevantes y cómo planeas recolectar la información.',
  7,
  15
),

(
  'Construye tu equipo fundador',
  'Ningún emprendimiento social escala con una sola persona. Construir un equipo fundador sólido es crucial para complementar tus habilidades, distribuir responsabilidades y mantener la motivación en los momentos difíciles. Tu equipo no necesita ser grande al inicio, pero sí debe cubrir las competencias críticas que tu emprendimiento necesita.

Identifica las tres áreas fundamentales que debe cubrir tu equipo: operaciones (quién ejecuta la solución día a día), crecimiento (quién atrae beneficiarios, aliados y recursos) y finanzas/administración (quién maneja el dinero y la organización). No necesitas tres personas distintas al inicio, pero sí necesitas que alguien sea responsable de cada área, aunque una persona cubra dos roles temporalmente.

Reflexiona sobre tu equipo actual o ideal: ¿Qué habilidades tienes tú? ¿Qué habilidades te faltan? ¿Conoces personas que compartan tu misión y complementen tus fortalezas? Describe cómo planeas reclutar o involucrar a tu equipo fundador y qué rol específico jugaría cada integrante.',
  8,
  15
);
