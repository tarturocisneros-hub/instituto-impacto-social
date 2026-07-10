import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Badge, UserBadge } from '../types/database';
import styles from './Gamification.module.css';

const levelConfig = [
  { level: 1, name: 'Explorador', minPoints: 0, maxPoints: 50, emoji: '🔰' },
  { level: 2, name: 'Agente de Cambio', minPoints: 50, maxPoints: 150, emoji: '⭐' },
  { level: 3, name: 'Impulsor Social', minPoints: 150, maxPoints: 300, emoji: '🌟' },
  { level: 4, name: 'Transformador', minPoints: 300, maxPoints: 500, emoji: '💫' },
  { level: 5, name: 'Líder de Impacto', minPoints: 500, maxPoints: 1000, emoji: '🏆' },
];

export default function Gamification() {
  const { profile } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);

  useEffect(() => {
    loadGamification();
  }, []);

  async function loadGamification() {
    const { data: allBadges } = await supabase.from('badges').select('*');
    if (allBadges) setBadges(allBadges as Badge[]);

    if (profile) {
      const { data: earned } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', profile.user_id);
      if (earned) setUserBadges(earned as UserBadge[]);
    }
  }

  const currentLevel = levelConfig.find(
    l => (profile?.points || 0) >= l.minPoints && (profile?.points || 0) < l.maxPoints
  ) || levelConfig[levelConfig.length - 1];

  const progressToNext = currentLevel.maxPoints > currentLevel.minPoints
    ? (((profile?.points || 0) - currentLevel.minPoints) / (currentLevel.maxPoints - currentLevel.minPoints)) * 100
    : 100;

  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

  return (
    <div className={styles.page}>
      <h1>Tu camino de impacto</h1>

      {/* Level Card */}
      <div className={styles.levelCard}>
        <div className={styles.levelEmoji}>{currentLevel.emoji}</div>
        <div className={styles.levelInfo}>
          <h2>Nivel {currentLevel.level}: {currentLevel.name}</h2>
          <p>{profile?.points || 0} puntos</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressToNext}%` }} />
          </div>
          <span className={styles.progressLabel}>
            {Math.round(progressToNext)}% para el siguiente nivel
          </span>
        </div>
      </div>

      {/* How to earn points */}
      <section className={styles.section}>
        <h2>Cada acción cuenta</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
          No se trata de puntos, se trata de constancia. Cada paso que das fortalece tu proyecto y tu comunidad.
        </p>
        <div className={styles.pointsList}>
          <div className={styles.pointItem}>
            <span className={styles.pointValue}>+10</span>
            <span>Dar el primer paso: registrar tu proyecto</span>
          </div>
          <div className={styles.pointItem}>
            <span className={styles.pointValue}>+5</span>
            <span>Documentar tu avance (seguimiento)</span>
          </div>
          <div className={styles.pointItem}>
            <span className={styles.pointValue}>+10</span>
            <span>Cumplir un hito de tu proyecto</span>
          </div>
          <div className={styles.pointItem}>
            <span className={styles.pointValue}>+25</span>
            <span>Llevar tu proyecto al 100%</span>
          </div>
          <div className={styles.pointItem}>
            <span className={styles.pointValue}>+15</span>
            <span>Que un mentor valide tu proyecto</span>
          </div>
        </div>
      </section>

      {/* Level roadmap */}
      <section className={styles.section}>
        <h2>Niveles de Avance</h2>
        <div className={styles.roadmap}>
          {levelConfig.map(level => (
            <div
              key={level.level}
              className={`${styles.roadmapItem} ${(profile?.points || 0) >= level.minPoints ? styles.roadmapReached : ''}`}
            >
              <span className={styles.roadmapEmoji}>{level.emoji}</span>
              <div>
                <strong>Nivel {level.level}: {level.name}</strong>
                <span className={styles.roadmapPoints}>{level.minPoints} puntos</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Badges */}
      <section className={styles.section}>
        <h2>Insignias</h2>
        {badges.length === 0 ? (
          <p className={styles.empty}>Las insignias se irán desbloqueando conforme avances.</p>
        ) : (
          <div className={styles.badgesGrid}>
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`${styles.badgeCard} ${earnedBadgeIds.has(badge.id) ? styles.badgeEarned : styles.badgeLocked}`}
              >
                <span className={styles.badgeIcon}>{badge.icon}</span>
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
                {earnedBadgeIds.has(badge.id) && <span className={styles.badgeCheck}>✓ Obtenida</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
