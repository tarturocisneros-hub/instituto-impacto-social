# Tasks: Learning Missions

## Task 1: Database Schema and Seed Data

### Description
Create the database tables, triggers, RPC function, RLS policies, and seed data for the learning missions system in Supabase.

### Steps
- [x] 1.1 Create `mission_templates` table with columns: id (UUID PK), title (TEXT NOT NULL), lesson_content (TEXT NOT NULL), suggested_order (INTEGER NOT NULL), points_awarded (INTEGER NOT NULL DEFAULT 15), is_active (BOOLEAN NOT NULL DEFAULT true), created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- [x] 1.2 Create `learning_missions` table with columns: id (UUID PK), project_id (UUID NOT NULL FK → projects ON DELETE CASCADE), mission_template_id (UUID NOT NULL FK → mission_templates), reflection (TEXT NULLABLE), completed (BOOLEAN NOT NULL DEFAULT false), completed_at (TIMESTAMPTZ NULLABLE), created_at (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- [x] 1.3 Create index `idx_learning_missions_project_id` on `learning_missions(project_id)` and unique constraint on `(project_id, mission_template_id)`
- [x] 1.4 Enable RLS on `mission_templates`: allow SELECT for all authenticated users; restrict INSERT/UPDATE/DELETE to admin role
- [x] 1.5 Enable RLS on `learning_missions`: allow SELECT and UPDATE only for users who own the associated project (via `projects.user_id = auth.uid()`)
- [x] 1.6 Create trigger function `assign_missions_to_project()` that inserts one `learning_mission` per active template when a new project is created; handle errors with RAISE WARNING to not block project creation
- [x] 1.7 Create trigger `trg_assign_missions` AFTER INSERT on `projects` that executes `assign_missions_to_project()`
- [x] 1.8 Create RPC function `complete_mission(p_mission_id UUID, p_reflection TEXT)` that validates reflection ≥ 50 chars, marks mission complete, awards points to profile, recalculates project progress_percentage, and updates project level
- [x] 1.9 Seed `mission_templates` with 8 predefined missions in Spanish (es-MX): "Identifica el problema social que resuelves", "Define tu propuesta de valor social", "Mapea a tus beneficiarios directos", "Diseña tu modelo de ingresos sostenible", "Valida tu idea con 5 personas reales", "Crea tu primer prototipo o MVP", "Mide tu impacto social inicial", "Construye tu equipo fundador" — each with 2-3 paragraph lesson_content and suggested_order 1-8

### Acceptance Criteria
- Requirements 1 (1.1-1.5), 2 (2.1-2.5), 3 (3.1-3.4), 7 (7.1-7.3), 8 (8.1-8.3), 11 (11.1-11.4), 12 (12.1-12.4)

---

## Task 2: TypeScript Types and Pure Logic Module

### Description
Add TypeScript interfaces for the new database tables and create a pure logic module with validation, progress calculation, level determination, ordering, and snippet truncation utilities.

### Steps
- [x] 2.1 Add `MissionTemplate` and `LearningMission` interfaces to `src/types/database.ts` matching the database schema
- [x] 2.2 Create `src/lib/missions.ts` with exported pure functions: `validateReflection(text: string): { valid: boolean; error?: string }` — returns valid if length ≥ 50
- [x] 2.3 Add `calculateProgress(total: number, completed: number): number` — returns ROUND(completed / total * 100) or 0 if total is 0
- [x] 2.4 Add `determineLevel(progressPercentage: number): ProjectLevel` — returns semilla (0-24), brote (25-49), arbol (50-74), bosque (75-100)
- [x] 2.5 Add `sortMissionsByOrder(missions: LearningMission[]): LearningMission[]` — sorts by mission_template.suggested_order ascending
- [x] 2.6 Add `getReflectionSnippet(reflection: string | null): string` — returns first 80 characters or full text if shorter, empty string if null
- [x] 2.7 Add `getMissionSummary(missions: LearningMission[]): string` — returns "X de Y misiones completadas"

### Acceptance Criteria
- Requirements 5 (5.2), 8 (8.1-8.3), 9 (9.1, 9.4), 10 (10.3)

---

## Task 3: Property-Based Tests for Pure Logic

### Description
Install fast-check and write property-based tests for the pure logic functions in `src/lib/missions.ts`.

### Steps
- [x] 3.1 Install `fast-check` and `vitest` as dev dependencies; configure vitest in `vite.config.ts` if not already configured
- [x] 3.2 Create `src/lib/missions.test.ts` with property test for reflection validation boundary (Property 2): generate strings length 0-200, verify validation result matches length ≥ 50
  - Tag: `Feature: learning-missions, Property 2: Reflection validation boundary`
- [x] 3.3 Write property test for progress calculation (Property 7): generate pairs (total 1-100, completed 0-total), verify formula ROUND(completed/total*100)
  - Tag: `Feature: learning-missions, Property 7: Progress calculation correctness`
- [x] 3.4 Write property test for level determination (Property 8): generate percentages 0-100, verify correct level assignment per threshold ranges
  - Tag: `Feature: learning-missions, Property 8: Level determination from progress`
- [x] 3.5 Write property test for mission ordering (Property 9): generate arrays of missions with random suggested_order values, verify sort produces ascending order
  - Tag: `Feature: learning-missions, Property 9: Mission list ordering`
- [x] 3.6 Write property test for summary count (Property 10): generate lists of missions with random completed states, verify summary text matches "C de T misiones completadas"
  - Tag: `Feature: learning-missions, Property 10: Summary count accuracy`
- [x] 3.7 Write property test for snippet truncation (Property 11): generate strings length 0-500, verify output is first 80 chars (or full text if < 80)
  - Tag: `Feature: learning-missions, Property 11: Reflection snippet truncation`

### Acceptance Criteria
- Correctness Properties 2, 7, 8, 9, 10, 11

---

## Task 4: MissionList Component

### Description
Create the `MissionList` React component that displays all learning missions for a project with their status, ordered by suggested_order.

### Steps
- [x] 4.1 Create `src/components/missions/MissionList.tsx` accepting props: `missions: LearningMission[]`, `onSelectMission: (mission: LearningMission) => void`, `selectedMissionId?: string`
- [x] 4.2 Display summary header "X de Y misiones completadas" using `getMissionSummary` utility
- [x] 4.3 Render each mission as a clickable card showing: title, completion status indicator (checkmark icon for completed, circle for pending), and points value
- [x] 4.4 For completed missions, show a snippet of the reflection text (first 80 chars) using `getReflectionSnippet`
- [x] 4.5 Visually distinguish completed missions (muted style, checkmark) from incomplete missions (active style, highlight)
- [x] 4.6 Highlight the currently selected mission card
- [x] 4.7 Create `src/components/missions/MissionList.module.css` with styles matching the app's existing design system (CSS variables, card patterns from Gamification page)

### Acceptance Criteria
- Requirements 9 (9.1-9.5), 10 (10.3)

---

## Task 5: MissionDetailView and ReflectionForm Components

### Description
Create the mission detail view showing lesson content and the reflection form with validation.

### Steps
- [x] 5.1 Create `src/components/missions/MissionDetailView.tsx` accepting props: `mission: LearningMission`, `onComplete: () => void`
- [x] 5.2 Display the mission title and lesson_content formatted as readable paragraphs with adequate min-height
- [x] 5.3 When mission is completed: display reflection text in read-only mode with the completion date formatted in es-MX locale
- [x] 5.4 When mission is incomplete: render `ReflectionForm` component
- [x] 5.5 Create `src/components/missions/ReflectionForm.tsx` accepting props: `missionId: string`, `onSubmitSuccess: () => void`
- [x] 5.6 Implement textarea with character counter showing current length and minimum (50) requirement
- [x] 5.7 Disable "Completar Misión" button when reflection < 50 characters; show validation message if user attempts to submit with insufficient text
- [x] 5.8 On valid submission: call Supabase RPC `complete_mission` with mission_id and reflection text; show loading spinner during submission; disable textarea to prevent double-submit
- [x] 5.9 Handle errors: show toast/message on failure, preserve textarea content for retry
- [x] 5.10 Create `src/components/missions/MissionDetailView.module.css` and `src/components/missions/ReflectionForm.module.css` with consistent styling

### Acceptance Criteria
- Requirements 4 (4.1-4.4), 5 (5.1-5.5), 6 (6.1-6.3)

---

## Task 6: Integrate Missions into ProjectDetail Page

### Description
Replace the existing "Hitos del Proyecto" section in `ProjectDetail.tsx` with the new "Misiones de Aprendizaje" section.

### Steps
- [x] 6.1 Add state variables for missions (`LearningMission[]`) and selected mission to `ProjectDetail.tsx`
- [x] 6.2 Fetch learning missions with joined mission_template data on project load: `supabase.from('learning_missions').select('*, mission_template:mission_templates(*)').eq('project_id', id).order('mission_template(suggested_order)')`
- [x] 6.3 Remove the "Hitos del Proyecto" section (milestones state, milestone fetch, toggleMilestone function, and milestone UI)
- [x] 6.4 Remove the manual progress buttons section (the 25/50/75/100% buttons) since progress is now driven by mission completion
- [x] 6.5 Add "Misiones de Aprendizaje" section with `MissionList` and conditionally rendered `MissionDetailView`
- [x] 6.6 Implement `reloadMissions` callback that re-fetches missions and project data after a mission is completed (to reflect updated progress and points)
- [x] 6.7 Handle empty state: when no missions are assigned, show message "No hay misiones disponibles aún"
- [x] 6.8 Add loading skeleton while missions are being fetched

### Acceptance Criteria
- Requirements 4 (4.1), 9 (9.1-9.5)

---

## Task 7: Update Navigation and Styles

### Description
Ensure the missions section integrates smoothly with the existing app styling and update any navigation references.

### Steps
- [x] 7.1 Update `src/pages/ProjectDetail.module.css` to add styles for the missions section container, ensuring consistent spacing with existing sections
- [x] 7.2 Verify that the Layout sidebar and dashboard still link correctly to projects (no broken references after removing milestones)
- [x] 7.3 Update the Dashboard points display to reflect that mission completion is now the primary source of project progress
- [x] 7.4 Ensure all new CSS modules use existing CSS custom properties (--primary, --gray-*, etc.) for consistent theming
- [x] 7.5 Test responsive layout: mission list and detail view should stack vertically on mobile screens (< 768px)

### Acceptance Criteria
- Requirements 4 (4.4), 9 (9.3)

---

## Task 8: Final Integration Testing and Cleanup

### Description
Run the full build, verify type-checking passes, and ensure no regressions in existing functionality.

### Steps
- [x] 8.1 Run `npm run typecheck` to verify all TypeScript types are correct with no errors
- [x] 8.2 Run `npm run build` to verify production build succeeds
- [x] 8.3 Run property-based tests with `npx vitest --run` to verify all 6 property tests pass
- [x] 8.4 Verify that the `Milestone` type import can be safely removed from `ProjectDetail.tsx` if no longer used elsewhere
- [x] 8.5 Verify that the Gamification page still correctly displays points (since mission completion now adds points via the same `profiles.points` field)
- [x] 8.6 Create SQL migration file `supabase/migrations/001_learning_missions.sql` consolidating all schema changes, trigger, RPC, RLS policies, and seed data into a single executable migration

### Acceptance Criteria
- All requirements validated through build, type-check, and tests passing
