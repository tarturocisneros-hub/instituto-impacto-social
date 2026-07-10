# Requirements Document

## Introduction

El sistema de Misiones de Aprendizaje transforma la sección existente "Hitos del Proyecto" en un sistema estructurado de aprendizaje guiado. Cada misión enseña un concepto de emprendimiento social y requiere que el emprendedor reflexione sobre cómo aplica la lección a su empresa social específica. Las misiones son predefinidas por el Instituto, se asignan automáticamente al crear un proyecto, y su completación alimenta el progreso del proyecto y el sistema de gamificación existente.

## Glossary

- **Mission_Template**: Plantilla predefinida de una misión de aprendizaje almacenada en la base de datos, que contiene el título, contenido de la lección y puntos asignados
- **Learning_Mission**: Instancia de una misión de aprendizaje asignada a un proyecto específico, con su estado de completación y reflexión
- **Reflection**: Texto escrito por el emprendedor describiendo cómo aplicó el concepto de la misión a su emprendimiento social
- **Lesson_Content**: Contenido educativo de 2-3 párrafos que enseña un concepto de emprendimiento social dentro de una misión
- **Mission_Assignment_Service**: Componente del sistema responsable de asignar misiones a proyectos nuevos
- **Mission_Completion_Service**: Componente del sistema responsable de validar y procesar la completación de misiones
- **Progress_Calculator**: Componente que calcula el porcentaje de progreso del proyecto basado en misiones completadas
- **Entrepreneur**: Usuario con rol "emprendedor" que es dueño de un proyecto y completa misiones de aprendizaje
- **Project_Detail_Page**: Página existente en la ruta /plataforma/projects/:id donde se muestra la información del proyecto

## Requirements

### Requirement 1: Mission Template Data Model

**User Story:** As an admin, I want to define learning mission templates in the database, so that they can be reused across all projects.

#### Acceptance Criteria

1. THE Mission_Template SHALL store a unique identifier, title, lesson content, suggested order, and points value for each template
2. THE Mission_Template SHALL store the lesson content as text supporting 2-3 paragraphs of educational material
3. THE Mission_Template SHALL include a suggested_order field as an integer to indicate the recommended sequence of missions
4. THE Mission_Template SHALL include a points_awarded field with a default value of 15 points
5. THE Mission_Template SHALL include an is_active boolean field defaulting to true to allow enabling or disabling templates without deletion

### Requirement 2: Learning Mission Instance Data Model

**User Story:** As an entrepreneur, I want each mission assigned to my project to track my individual progress, so that I can complete missions at my own pace.

#### Acceptance Criteria

1. THE Learning_Mission SHALL store a reference to the project it belongs to, the mission template it derives from, the reflection text, completion status, and completion timestamp
2. THE Learning_Mission SHALL store the reflection field as nullable text, empty until the Entrepreneur writes a response
3. THE Learning_Mission SHALL store a completed boolean field defaulting to false
4. THE Learning_Mission SHALL store a completed_at timestamp that is null until the mission is marked complete
5. THE Learning_Mission SHALL maintain referential integrity by cascading deletion when the parent project is deleted

### Requirement 3: Automatic Mission Assignment

**User Story:** As an entrepreneur, I want learning missions automatically assigned to my project when I create it, so that I have a structured learning path from day one.

#### Acceptance Criteria

1. WHEN a new project is created, THE Mission_Assignment_Service SHALL create one Learning_Mission instance for each active Mission_Template in the database
2. WHEN a new project is created, THE Mission_Assignment_Service SHALL assign all active mission templates regardless of the project category
3. WHEN a new project is created, THE Mission_Assignment_Service SHALL set all created Learning_Mission instances to incomplete status with null reflection
4. IF the Mission_Assignment_Service fails to assign missions during project creation, THEN THE Mission_Assignment_Service SHALL log the error and allow the project creation to succeed without missions

### Requirement 4: Mission Detail View

**User Story:** As an entrepreneur, I want to view the lesson content of a mission, so that I can learn the entrepreneurship concept before reflecting on it.

#### Acceptance Criteria

1. WHEN the Entrepreneur selects a Learning_Mission from the list, THE Project_Detail_Page SHALL display the mission title, lesson content, and a reflection input field
2. WHEN the Entrepreneur views a completed Learning_Mission, THE Project_Detail_Page SHALL display the saved reflection text in read-only mode
3. WHEN the Entrepreneur views an incomplete Learning_Mission, THE Project_Detail_Page SHALL display an empty text area for writing the reflection
4. THE Project_Detail_Page SHALL display the lesson content formatted in readable paragraphs with a minimum height adequate for 2-3 paragraphs of text

### Requirement 5: Reflection Submission

**User Story:** As an entrepreneur, I want to write how I applied the lesson to my project, so that I document my learning journey.

#### Acceptance Criteria

1. WHEN the Entrepreneur writes text in the reflection field and submits, THE Mission_Completion_Service SHALL save the reflection text to the Learning_Mission record
2. THE Mission_Completion_Service SHALL require a minimum of 50 characters in the reflection text before allowing submission
3. IF the reflection text contains fewer than 50 characters, THEN THE Mission_Completion_Service SHALL display a validation message indicating the minimum length requirement
4. WHEN the Entrepreneur submits a valid reflection, THE Mission_Completion_Service SHALL mark the Learning_Mission as completed and record the current timestamp in completed_at
5. WHEN the Entrepreneur submits a valid reflection, THE Mission_Completion_Service SHALL persist the reflection text so it cannot be modified after completion

### Requirement 6: Completion Gating

**User Story:** As an entrepreneur, I want the system to require a reflection before marking a mission complete, so that I engage meaningfully with each lesson.

#### Acceptance Criteria

1. WHILE a Learning_Mission has a null or empty reflection, THE Project_Detail_Page SHALL disable the completion action for that mission
2. WHILE a Learning_Mission has a reflection with fewer than 50 characters, THE Project_Detail_Page SHALL disable the completion action for that mission
3. WHEN the Entrepreneur has written a reflection meeting the minimum length, THE Project_Detail_Page SHALL enable the completion action for that mission

### Requirement 7: Points Award on Completion

**User Story:** As an entrepreneur, I want to earn points when I complete a mission, so that my learning progress is recognized in the gamification system.

#### Acceptance Criteria

1. WHEN a Learning_Mission is marked as completed, THE Mission_Completion_Service SHALL add the mission's points_awarded value to the Entrepreneur's profile points total
2. WHEN a Learning_Mission is marked as completed, THE Mission_Completion_Service SHALL use the points_awarded value defined in the associated Mission_Template
3. THE Mission_Completion_Service SHALL award points exactly once per Learning_Mission completion

### Requirement 8: Progress Calculation

**User Story:** As an entrepreneur, I want my project progress to reflect my completed missions, so that I can see my overall advancement.

#### Acceptance Criteria

1. WHEN a Learning_Mission is completed, THE Progress_Calculator SHALL recalculate the project's progress_percentage as the ratio of completed missions to total assigned missions multiplied by 100, rounded to the nearest integer
2. WHEN the progress_percentage is recalculated, THE Progress_Calculator SHALL update the project's level field based on existing thresholds (semilla: 0-24%, brote: 25-49%, arbol: 50-74%, bosque: 75-100%)
3. THE Progress_Calculator SHALL treat each mission with equal weight in the progress calculation

### Requirement 9: Mission List UI

**User Story:** As an entrepreneur, I want to see all my learning missions with their status in the project detail view, so that I know what to work on next.

#### Acceptance Criteria

1. THE Project_Detail_Page SHALL display a list of all Learning_Missions assigned to the project, ordered by the Mission_Template's suggested_order field
2. THE Project_Detail_Page SHALL display each mission with its title, completion status indicator, and points value
3. THE Project_Detail_Page SHALL visually distinguish completed missions from incomplete missions using distinct styling
4. THE Project_Detail_Page SHALL display a summary showing the count of completed missions out of total missions (e.g., "3 de 8 misiones completadas")
5. THE Project_Detail_Page SHALL replace the existing "Hitos del Proyecto" section with the new "Misiones de Aprendizaje" section

### Requirement 10: Reflection History Display

**User Story:** As an entrepreneur, I want to review my past reflections within the project, so that I can see my documented learning journey.

#### Acceptance Criteria

1. WHEN the Entrepreneur views a completed Learning_Mission, THE Project_Detail_Page SHALL display the reflection text along with the completion date
2. THE Project_Detail_Page SHALL display completed mission reflections formatted as readable text blocks with the completion timestamp in es-MX locale format
3. WHEN the Entrepreneur views the mission list, THE Project_Detail_Page SHALL indicate which missions have reflections available by showing a preview snippet of the reflection text (first 80 characters)

### Requirement 11: Mission Template Seeding

**User Story:** As an admin, I want predefined missions seeded in the database, so that entrepreneurs have a curated learning path available immediately.

#### Acceptance Criteria

1. THE Mission_Template table SHALL be seeded with at least 8 predefined learning missions covering core social entrepreneurship concepts
2. THE Mission_Template seed data SHALL include lesson content in Spanish (es-MX) for each mission
3. THE Mission_Template seed data SHALL include the following missions in order: "Identifica el problema social que resuelves", "Define tu propuesta de valor social", "Mapea a tus beneficiarios directos", "Diseña tu modelo de ingresos sostenible", "Valida tu idea con 5 personas reales", "Crea tu primer prototipo o MVP", "Mide tu impacto social inicial", "Construye tu equipo fundador"
4. THE Mission_Template seed data SHALL assign suggested_order values from 1 to 8 corresponding to the mission sequence

### Requirement 12: Database Security

**User Story:** As an entrepreneur, I want my mission data protected so that only I can view and modify my own missions and reflections.

#### Acceptance Criteria

1. THE Learning_Mission table SHALL enforce Row Level Security so that only the project owner can view missions assigned to their projects
2. THE Learning_Mission table SHALL enforce Row Level Security so that only the project owner can update the reflection and completion status of their missions
3. THE Mission_Template table SHALL allow all authenticated users to read template data
4. THE Mission_Template table SHALL restrict insert, update, and delete operations on templates to users with the admin role
