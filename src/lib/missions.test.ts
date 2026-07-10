import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateReflection,
  calculateProgress,
  determineLevel,
  sortMissionsByOrder,
  getReflectionSnippet,
  getMissionSummary,
} from './missions';
import type { LearningMission, MissionTemplate } from '../types/database';

/**
 * **Validates: Requirements 5.2, 6.1, 6.2, 6.3**
 */
describe('Feature: learning-missions, Property 2: Reflection validation boundary', () => {
  it('strings shorter than 50 characters are invalid, strings >= 50 are valid', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 200 }), (text) => {
        const result = validateReflection(text);
        if (text.length < 50) {
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
        } else {
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 8.1, 8.3**
 */
describe('Feature: learning-missions, Property 7: Progress calculation correctness', () => {
  it('calculates progress as ROUND(completed / total * 100) for valid inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }).chain((total) =>
          fc.tuple(fc.constant(total), fc.integer({ min: 0, max: total }))
        ),
        ([total, completed]) => {
          const result = calculateProgress(total, completed);
          const expected = Math.round((completed / total) * 100);
          expect(result).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns 0 when total is 0', () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });
});

/**
 * **Validates: Requirements 8.2**
 */
describe('Feature: learning-missions, Property 8: Level determination from progress', () => {
  it('returns the correct level for any percentage 0-100', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100 }), (percentage) => {
        const level = determineLevel(percentage);
        if (percentage >= 75) {
          expect(level).toBe('bosque');
        } else if (percentage >= 50) {
          expect(level).toBe('arbol');
        } else if (percentage >= 25) {
          expect(level).toBe('brote');
        } else {
          expect(level).toBe('semilla');
        }
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 9.1**
 */
describe('Feature: learning-missions, Property 9: Mission list ordering', () => {
  it('sortMissionsByOrder produces ascending order by suggested_order', () => {
    const missionArb = fc
      .integer({ min: 1, max: 1000 })
      .map((order) => createMockMission(order));

    fc.assert(
      fc.property(fc.array(missionArb, { minLength: 0, maxLength: 20 }), (missions) => {
        const sorted = sortMissionsByOrder(missions);
        for (let i = 1; i < sorted.length; i++) {
          const prevOrder = sorted[i - 1].mission_template?.suggested_order ?? Number.MAX_SAFE_INTEGER;
          const currOrder = sorted[i].mission_template?.suggested_order ?? Number.MAX_SAFE_INTEGER;
          expect(prevOrder).toBeLessThanOrEqual(currOrder);
        }
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 9.4**
 */
describe('Feature: learning-missions, Property 10: Summary count accuracy', () => {
  it('getMissionSummary returns "C de T misiones completadas" with correct counts', () => {
    const missionWithStateArb = fc.boolean().map((completed) => createMockMissionWithState(completed));

    fc.assert(
      fc.property(fc.array(missionWithStateArb, { minLength: 0, maxLength: 30 }), (missions) => {
        const summary = getMissionSummary(missions);
        const total = missions.length;
        const completedCount = missions.filter((m) => m.completed).length;
        expect(summary).toBe(`${completedCount} de ${total} misiones completadas`);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 10.3**
 */
describe('Feature: learning-missions, Property 11: Reflection snippet truncation', () => {
  it('returns full string if <= 80 chars, first 80 chars if > 80, empty for null', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 500 }), (text) => {
        const snippet = getReflectionSnippet(text);
        if (text.length <= 80) {
          expect(snippet).toBe(text);
        } else {
          expect(snippet).toBe(text.substring(0, 80));
          expect(snippet.length).toBe(80);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('returns empty string for null input', () => {
    expect(getReflectionSnippet(null)).toBe('');
  });
});

// --- Helper functions ---

function createMockMission(suggestedOrder: number): LearningMission {
  return {
    id: crypto.randomUUID(),
    project_id: 'project-1',
    mission_template_id: 'template-1',
    reflection: null,
    completed: false,
    completed_at: null,
    created_at: '2024-01-01T00:00:00Z',
    mission_template: {
      id: 'template-1',
      title: 'Test Mission',
      lesson_content: 'Test content',
      suggested_order: suggestedOrder,
      points_awarded: 15,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
  };
}

function createMockMissionWithState(completed: boolean): LearningMission {
  return {
    id: crypto.randomUUID(),
    project_id: 'project-1',
    mission_template_id: 'template-1',
    reflection: completed ? 'Some reflection text that is long enough' : null,
    completed,
    completed_at: completed ? '2024-01-15T10:00:00Z' : null,
    created_at: '2024-01-01T00:00:00Z',
    mission_template: {
      id: 'template-1',
      title: 'Test Mission',
      lesson_content: 'Test content',
      suggested_order: 1,
      points_awarded: 15,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
  };
}
