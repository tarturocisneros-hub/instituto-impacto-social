import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Project } from '../types/database';
import { TrendingUp, Users, FolderKanban, Trophy, ArrowRight } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    beneficiaries: 0,
    points: 0
  });

  useEffect(() => {
    if (profile) {
      loadDashboard();
    }
  }, [profile]);

  async function loadDashboard() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', profile!.user_id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setProjects(data as Project[]);
      setStats({
        total: data.length,
        active: data.filter(p => p.status === 'en_progreso').length,
        beneficiaries: data.reduce((sum, p) => sum + (p.estimated_beneficiaries || 0), 0),
        points: profile!.points
      });
    }
  }

  const levelNames: Record<string, string> = {
    semilla: '🌱 Semilla',
    brote: '🌿 Brote',
    arbol: '🌳 Árbol',
    bosque: '🌲 Bosque'
  };

  const statusLabels: Record<string, string> = {
    borrador: 'Borrador',
    en_revision: 'En Revisión',
    aprobado: 'Aprobado',
    en_progreso: 'En Progreso',
    completado: 'Completado',
    pausado: 'Pausado'
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>Bienvenido, {profile?.full_name?.split(' ')[0]} 👋</h1>
        <p>Tu entusiasmo se transforma en acción aquí. Esto es tu espacio de impacto.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FolderKanban size={24} className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Proyectos</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <TrendingUp size={24} className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{stats.active}</span>
            <span className={styles.statLabel}>Activos</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Users size={24} className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{stats.beneficiaries.toLocaleString()}</span>
            <span className={styles.statLabel}>Beneficiarios</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Trophy size={24} className={styles.statIcon} />
          <div>
            <span className={styles.statValue}>{stats.points}</span>
            <span className={styles.statLabel}>Puntos</span>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Proyectos recientes</h2>
          <Link to="/plataforma/projects" className={styles.viewAll}>
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyEmoji}>🌍</div>
            <h3 className={styles.emptyTitle}>El México que soñamos se construye con proyectos que funcionan</h3>
            <p className={styles.emptyDesc}>
              No estás aquí por casualidad. Eres parte de una generación que se niega a elegir entre éxito profesional 
              y propósito social. Registra tu proyecto y deja de caminar solo.
            </p>
            <div className={styles.emptyFeatures}>
              <div className={styles.emptyFeature}>
                <span>🤝</span>
                <span><strong>Acompañamiento</strong> — Mentores y pares que comparten tu visión</span>
              </div>
              <div className={styles.emptyFeature}>
                <span>✅</span>
                <span><strong>Validación profesional</strong> — Te ayudamos a generar evidencias reales que validen tu proyecto</span>
              </div>
              <div className={styles.emptyFeature}>
                <span>🚀</span>
                <span><strong>Visibilidad de alto impacto</strong> — Creamos oportunidades para conectar tu proyecto con aliados y fondeadores</span>
              </div>
              <div className={styles.emptyFeature}>
                <span>💡</span>
                <span><strong>Sentido de propósito</strong> — Tu energía profesional alineada con tus valores</span>
              </div>
            </div>
            <Link to="/plataforma/projects/new" className={styles.ctaBtn}>
              Comenzar mi proyecto de impacto
            </Link>
            <p className={styles.emptyHint}>
              Porque a todos nos va mejor cuando alguien decide actuar.
            </p>
          </div>
        ) : (
          <div className={styles.projectList}>
            {projects.map(project => (
              <Link key={project.id} to={`/projects/${project.id}`} className={styles.projectCard}>
                <div className={styles.projectTop}>
                  <span className={styles.projectLevel}>{levelNames[project.level] || project.level}</span>
                  <span className={`${styles.projectStatus} ${styles[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDesc}>{project.description.slice(0, 100)}...</p>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${project.progress_percentage}%` }}
                  />
                </div>
                <span className={styles.progressText}>{project.progress_percentage}% completado</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
