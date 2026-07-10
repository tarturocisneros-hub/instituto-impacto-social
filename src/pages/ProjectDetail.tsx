import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Project, FollowUp, LearningMission } from '../types/database';
import { Calendar, MapPin, Users, Target, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import MissionList from '../components/missions/MissionList';
import styles from './ProjectDetail.module.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [missions, setMissions] = useState<LearningMission[]>([]);
  const [selectedMission, setSelectedMission] = useState<LearningMission | null>(null);
  const [missionsLoading, setMissionsLoading] = useState(true);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpType, setFollowUpType] = useState<FollowUp['type']>('avance');
  const [followUpContent, setFollowUpContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadProject();
  }, [id]);

  async function loadProject() {
    if (!id) return;
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (data) setProject(data as Project);

    const { data: fups } = await supabase
      .from('follow_ups')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });
    if (fups) setFollowUps(fups as FollowUp[]);

    const { data: missionsData, error: missionsError } = await supabase
      .from('learning_missions')
      .select('*, mission_template:mission_templates(*)')
      .eq('project_id', id)
      .order('mission_template(suggested_order)');
    if (!missionsError && missionsData) setMissions(missionsData as LearningMission[]);
    setMissionsLoading(false);
  }

  const reloadMissions = useCallback(async () => {
    if (!id) return;
    setMissionsLoading(true);

    const { data: missionsData, error: missionsError } = await supabase
      .from('learning_missions')
      .select('*, mission_template:mission_templates(*)')
      .eq('project_id', id)
      .order('mission_template(suggested_order)');
    if (!missionsError && missionsData) {
      setMissions(missionsData as LearningMission[]);
      // Update selectedMission with fresh data
      if (selectedMission) {
        const updated = missionsData.find((m) => m.id === selectedMission.id);
        if (updated) setSelectedMission(updated as LearningMission);
      }
    }

    // Re-fetch project to get updated progress_percentage and level
    const { data: projectData } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (projectData) setProject(projectData as Project);

    setMissionsLoading(false);
  }, [id, selectedMission]);

  async function addFollowUp() {
    if (!profile || !id || !followUpContent.trim()) return;
    setSaving(true);

    const { error } = await supabase.from('follow_ups').insert({
      project_id: id,
      user_id: profile.user_id,
      type: followUpType,
      content: followUpContent,
    });

    if (!error) {
      // Award points for adding a follow-up
      await supabase.from('profiles').update({
        points: (profile.points || 0) + 5
      }).eq('user_id', profile.user_id);

      setFollowUpContent('');
      setShowFollowUpForm(false);
      loadProject();
    }
    setSaving(false);
  }

  async function deleteProject() {
    if (!project) return;
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.');
    if (!confirmed) return;
    
    await supabase.from('projects').delete().eq('id', project.id);
    navigate('/plataforma/projects');
  }

  if (!project) {
    return <div className={styles.loading}>Cargando proyecto...</div>;
  }

  const levelEmoji: Record<string, string> = {
    semilla: '🌱', brote: '🌿', arbol: '🌳', bosque: '🌲'
  };

  const followUpEmoji: Record<string, string> = {
    nota: '📝', avance: '📈', problema: '⚠️', logro: '🏆'
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Volver
        </button>
        <button className={styles.deleteBtn} onClick={deleteProject}>
          <Trash2 size={16} /> Eliminar proyecto
        </button>
      </div>

      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <span className={styles.level}>{levelEmoji[project.level]} {project.level}</span>
          <span className={`${styles.status} ${styles[project.status]}`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>
        <h1>{project.title}</h1>
        <p className={styles.desc}>{project.description}</p>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <MapPin size={16} />
            <span>{project.location_city ? `${project.location_city}, ` : ''}{project.location_state}</span>
          </div>
          <div className={styles.metaItem}>
            <Users size={16} />
            <span>{project.estimated_beneficiaries.toLocaleString()} beneficiarios</span>
          </div>
          <div className={styles.metaItem}>
            <Calendar size={16} />
            <span>Inicio: {new Date(project.start_date).toLocaleDateString('es-MX')}</span>
          </div>
          <div className={styles.metaItem}>
            <Target size={16} />
            <span>Equipo: {project.team_size} personas</span>
          </div>
        </div>

        {/* Progress */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>Progreso del proyecto</span>
            <span className={styles.progressValue}>{project.progress_percentage}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${project.progress_percentage}%` }} />
          </div>
        </div>
      </div>

      {/* Misiones de Aprendizaje */}
      <section className={styles.section}>
        <h2>Misiones de Aprendizaje</h2>
        {missionsLoading ? (
          <div className={styles.loadingSkeleton}>Cargando misiones...</div>
        ) : missions.length === 0 ? (
          <p className={styles.emptyState}>No hay misiones disponibles aún</p>
        ) : (
          <>
            <MissionList
              missions={missions}
              onSelectMission={setSelectedMission}
              selectedMissionId={selectedMission?.id}
              onComplete={reloadMissions}
            />
          </>
        )}
      </section>

      {/* Follow-ups (Retención y Seguimiento) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Seguimiento</h2>
          <button className={styles.addBtn} onClick={() => setShowFollowUpForm(true)}>
            <Plus size={18} /> Agregar
          </button>
        </div>

        {showFollowUpForm && (
          <div className={styles.followUpForm}>
            <select value={followUpType} onChange={(e) => setFollowUpType(e.target.value as FollowUp['type'])}>
              <option value="avance">📈 Avance</option>
              <option value="nota">📝 Nota</option>
              <option value="problema">⚠️ Problema</option>
              <option value="logro">🏆 Logro</option>
            </select>
            <textarea
              value={followUpContent}
              onChange={(e) => setFollowUpContent(e.target.value)}
              placeholder="Describe el avance, problema o logro..."
              rows={3}
            />
            <div className={styles.followUpActions}>
              <button onClick={() => setShowFollowUpForm(false)} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button onClick={addFollowUp} disabled={saving || !followUpContent.trim()} className={styles.saveBtn}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        )}

        {followUps.length === 0 ? (
          <p className={styles.empty}>No hay registros de seguimiento.</p>
        ) : (
          <div className={styles.timeline}>
            {followUps.map(fu => (
              <div key={fu.id} className={styles.timelineItem}>
                <span className={styles.timelineIcon}>{followUpEmoji[fu.type]}</span>
                <div className={styles.timelineContent}>
                  <p>{fu.content}</p>
                  <span className={styles.timelineDate}>
                    {new Date(fu.created_at).toLocaleDateString('es-MX', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
