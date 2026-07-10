import type { LearningMission, ProjectLevel } from '../types/database';

/**
 * Validates that a reflection text meets the minimum length requirement (50 characters).
 */
export function validateReflection(text: string): { valid: boolean; error?: string } {
  if (text.length < 50) {
    return {
      valid: false,
      error: 'Tu reflexión debe tener al menos 50 caracteres',
    };
  }
  return { valid: true };
}

/**
 * Calculates progress percentage from total and completed mission counts.
 * Returns 0 if total is 0 to avoid division by zero.
 */
export function calculateProgress(total: number, completed: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Determines the project level based on progress percentage.
 * semilla: 0-24%, brote: 25-49%, arbol: 50-74%, bosque: 75-100%
 */
export function determineLevel(progressPercentage: number): ProjectLevel {
  if (progressPercentage >= 75) return 'bosque';
  if (progressPercentage >= 50) return 'arbol';
  if (progressPercentage >= 25) return 'brote';
  return 'semilla';
}

/**
 * Sorts missions by their template's suggested_order in ascending order.
 * Missions without a mission_template are placed at the end.
 */
export function sortMissionsByOrder(missions: LearningMission[]): LearningMission[] {
  return [...missions].sort((a, b) => {
    const orderA = a.mission_template?.suggested_order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.mission_template?.suggested_order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
}

/**
 * Returns the first 80 characters of a reflection as a snippet preview.
 * Returns empty string if reflection is null.
 */
export function getReflectionSnippet(reflection: string | null): string {
  if (reflection === null) return '';
  if (reflection.length <= 80) return reflection;
  return reflection.substring(0, 80);
}

/**
 * Returns a summary string like "X de Y misiones completadas".
 */
export function getMissionSummary(missions: LearningMission[]): string {
  const total = missions.length;
  const completed = missions.filter((m) => m.completed).length;
  return `${completed} de ${total} misiones completadas`;
}
