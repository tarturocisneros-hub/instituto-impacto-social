import type { LearningMission } from '../../types/database';
import ReflectionForm from './ReflectionForm';
import styles from './MissionDetailView.module.css';

interface MissionDetailViewProps {
  mission: LearningMission;
  onComplete: () => void;
}

export default function MissionDetailView({
  mission,
  onComplete,
}: MissionDetailViewProps) {
  const title = mission.mission_template?.title ?? 'Misión';
  const lessonContent = mission.mission_template?.lesson_content ?? '';

  const paragraphs = lessonContent
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.lessonContent}>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {mission.completed ? (
        <div className={styles.completedSection}>
          <p className={styles.completedLabel}>✓ Misión completada</p>
          {mission.completed_at && (
            <p className={styles.completedDate}>
              Completada el{' '}
              {new Date(mission.completed_at).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          <p className={styles.reflectionReadonly}>{mission.reflection}</p>
        </div>
      ) : (
        <ReflectionForm missionId={mission.id} onSubmitSuccess={onComplete} />
      )}
    </div>
  );
}
