import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Project, ProjectStatus } from '../types/database';
import { PlusCircle } from 'lucide-react';
import styles from './Projects.module.css';

const statusLabels: Record<ProjectStatus, string> = {
  borrador: 'Borrador',
  en_revision: 'En Revisión',
  aprobado: 'Aprobado',
  en_progreso: 'En Progreso',
  completado: 'Completado',
  pausado: 'Pausado'
};

const categoryLabels: Record<string, string> = {
  educacion: 'Educación',
  salud: 'Salud',
  medio_ambiente: 'Medio Ambiente',
  tecnologia_social: 'Tecnología Social',
  economia_solidaria: 'Economía Solidaria',
  cultura: 'Cultura',
  derechos_humanos: 'Derechos Humanos',
  desarrollo_comunitario: 'Desarrollo Comunitario'
};

export default function Projects() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');

  useEffect(() => {
    loadProjects();
  }, [profile]);

  async function loadProjects() {
    if (!profile) return;
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', profile.user_id)
      .order('updated_at', { ascending: false });

    if (data) setProjects(data as Project[]);
  }

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Mis Proyectos</h1>
        <Link to="/plataforma/projects/new" className={styles.newBtn}>
          <PlusCircle size={20} />
          Nuevo Proyecto
        </Link>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({projects.length})
        </button>
        {(['en_progreso', 'borrador', 'aprobado', 'completado'] as ProjectStatus[]).map(status => (
          <button
            key={status}
            className={`${styles.filterBtn} ${filter === status ? styles.filterActive : ''}`}
            onClick={() => setFilter(status)}
          >
            {statusLabels[status]} ({projects.filter(p => p.status === status).length})
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay proyectos que mostrar.</p>
          <Link to="/plataforma/projects/new" className={styles.newBtn}>
            <PlusCircle size={18} />
            Crear Proyecto
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProjects.map(project => (
            <Link key={project.id} to={`/plataforma/projects/${project.id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>
                  {categoryLabels[project.category] || project.category}
                </span>
                <span className={`projectStatus ${project.status}`}>
                  {statusLabels[project.status]}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDesc}>
                {project.description.slice(0, 120)}{project.description.length > 120 ? '...' : ''}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.cardMeta}>
                  📍 {project.location_state}
                </span>
                <span className={styles.cardMeta}>
                  👥 {project.estimated_beneficiaries.toLocaleString()} beneficiarios
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
