import { CheckCircle, Circle, Star } from 'lucide-react';
import type { LearningMission } from '../../types/database';
import {
  getMissionSummary,
  getReflectionSnippet,
  sortMissionsByOrder,
} from '../../lib/missions';
import MissionDetailView from './MissionDetailView';
import styles from './MissionList.module.css';

interface MissionListProps {
  missions: LearningMission[];
  onSelectMission: (mission: LearningMission) => void;
  selectedMissionId?: string;
  onComplete?: () => void;
}

export default function MissionList({
  missions,
  onSelectMission,
  selectedMissionId,
  onComplete,
}: MissionListProps) {
  const sortedMissions = sortMissionsByOrder(missions);
  const summary = getMissionSummary(missions);

  return (
    <div className={styles.container}>
      <p className={styles.summaryHeader}>{summary}</p>

      <div className={styles.missionsList}>
        {sortedMissions.map((mission) => {
          const isSelected = mission.id === selectedMissionId;
          const isCompleted = mission.completed;

          const cardClasses = [
            styles.missionCard,
            isSelected ? styles.missionCardSelected : '',
            isCompleted ? styles.missionCardCompleted : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={mission.id}>
              <button
                className={cardClasses}
                onClick={() => onSelectMission(mission)}
                type="button"
                aria-pressed={isSelected}
                aria-expanded={isSelected}
              >
                <span className={styles.statusIcon}>
                  {isCompleted ? (
                    <CheckCircle
                      size={20}
                      className={styles.statusIconCompleted}
                    />
                  ) : (
                    <Circle size={20} className={styles.statusIconPending} />
                  )}
                </span>

                <div className={styles.missionContent}>
                  <p className={styles.missionTitle}>
                    {mission.mission_template?.title ?? 'Misión'}
                  </p>

                  <div className={styles.missionMeta}>
                    <span className={styles.missionPoints}>
                      <Star size={12} />
                      {mission.mission_template?.points_awarded ?? 0} pts
                    </span>
                  </div>

                  {isCompleted && mission.reflection && !isSelected && (
                    <p className={styles.reflectionSnippet}>
                      "{getReflectionSnippet(mission.reflection)}"
                    </p>
                  )}
                </div>
              </button>

              {isSelected && onComplete && (
                <MissionDetailView
                  mission={mission}
                  onComplete={onComplete}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
