import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ProjectCategory } from '../types/database';
import styles from './NewProject.module.css';

const categories: { value: ProjectCategory; label: string }[] = [
  { value: 'educacion', label: 'Educación' },
  { value: 'salud', label: 'Salud' },
  { value: 'medio_ambiente', label: 'Medio Ambiente' },
  { value: 'tecnologia_social', label: 'Tecnología Social' },
  { value: 'economia_solidaria', label: 'Economía Solidaria' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'derechos_humanos', label: 'Derechos Humanos' },
  { value: 'desarrollo_comunitario', label: 'Desarrollo Comunitario' },
];

const mexicanStates = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
  'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
  'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

const odsGoals = [
  { id: 1, label: '1. Fin de la pobreza' },
  { id: 2, label: '2. Hambre cero' },
  { id: 3, label: '3. Salud y bienestar' },
  { id: 4, label: '4. Educación de calidad' },
  { id: 5, label: '5. Igualdad de género' },
  { id: 6, label: '6. Agua limpia y saneamiento' },
  { id: 7, label: '7. Energía asequible' },
  { id: 8, label: '8. Trabajo decente' },
  { id: 9, label: '9. Industria e innovación' },
  { id: 10, label: '10. Reducción de desigualdades' },
  { id: 11, label: '11. Ciudades sostenibles' },
  { id: 12, label: '12. Producción responsable' },
  { id: 13, label: '13. Acción por el clima' },
  { id: 14, label: '14. Vida submarina' },
  { id: 15, label: '15. Vida de ecosistemas terrestres' },
  { id: 16, label: '16. Paz, justicia e instituciones' },
  { id: 17, label: '17. Alianzas para lograr objetivos' },
];

export default function NewProject() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as ProjectCategory | '',
    impact_area: '',
    target_beneficiaries: '',
    estimated_beneficiaries: 0,
    location_state: '',
    location_city: '',
    start_date: '',
    end_date: '',
    budget_estimated: 0,
    team_size: 1,
    ods_goals: [] as number[],
  });

  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleOds = (id: number) => {
    setForm(prev => ({
      ...prev,
      ods_goals: prev.ods_goals.includes(id)
        ? prev.ods_goals.filter(g => g !== id)
        : [...prev.ods_goals, id]
    }));
  };

  const validateStep = (s: number): boolean => {
    switch (s) {
      case 1:
        return !!form.title && !!form.description && !!form.category;
      case 2:
        return !!form.impact_area && !!form.target_beneficiaries;
      case 3:
        return !!form.location_state && !!form.start_date;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!profile) return;

    setError('');
    setSaving(true);

    const { error: insertError } = await supabase.from('projects').insert({
      user_id: profile.user_id,
      title: form.title,
      description: form.description,
      category: form.category as ProjectCategory,
      status: 'borrador',
      impact_area: form.impact_area,
      target_beneficiaries: form.target_beneficiaries,
      estimated_beneficiaries: form.estimated_beneficiaries,
      location_state: form.location_state,
      location_city: form.location_city,
      start_date: form.start_date,
      end_date: form.end_date || null,
      budget_estimated: form.budget_estimated || null,
      team_size: form.team_size,
      ods_goals: form.ods_goals,
      progress_percentage: 0,
      level: 'semilla',
    });

    if (insertError) {
      setError(insertError.message || 'Error al registrar el proyecto.');
      setSaving(false);
      return;
    }

    // Award points for creating a project
    await supabase.from('profiles').update({
      points: (profile.points || 0) + 10
    }).eq('user_id', profile.user_id);

    setSaving(false);
    navigate('/plataforma/projects');
  };

  return (
    <div className={styles.page}>
      <h1>Cuéntanos sobre tu proyecto</h1>
      <p className={styles.pageSubtitle}>
        No estás llenando un formulario, estás dando el primer paso para transformar tu entorno. 
        Un mentor revisará tu proyecto y te acompañará en el camino.
      </p>

      {/* Progress steps */}
      <div className={styles.steps}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`${styles.step} ${step >= s ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>{s}</span>
            <span className={styles.stepLabel}>
              {s === 1 && 'Tu idea'}
              {s === 2 && 'Tu impacto'}
              {s === 3 && 'Tu contexto'}
              {s === 4 && 'Tu visión'}
            </span>
          </div>
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2>¿Qué quieres construir?</h2>
            <p className={styles.stepHint}>Todo gran cambio empezó como una idea. Cuéntanos la tuya.</p>
            <div className={styles.field}>
              <label htmlFor="title">¿Cómo se llama tu proyecto?</label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="Ej: Huertos comunitarios para familias de Oaxaca"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="description">Cuéntanos de qué se trata</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="¿Qué problema quieres resolver? ¿Por qué te importa? No te preocupes por que sea perfecto, aquí te ayudamos a estructurarlo..."
                rows={5}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="category">¿En qué área trabaja tu proyecto?</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => updateForm('category', e.target.value)}
                required
              >
                <option value="">Selecciona el área más cercana</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Impact */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2>¿A quién vas a transformar?</h2>
            <p className={styles.stepHint}>Aquí definimos juntos el alcance real de tu proyecto. No necesitas tener todo resuelto.</p>
            <div className={styles.field}>
              <label htmlFor="impact_area">¿Qué problemática atacas?</label>
              <input
                id="impact_area"
                type="text"
                value={form.impact_area}
                onChange={(e) => updateForm('impact_area', e.target.value)}
                placeholder="Ej: Falta de acceso a educación digital en zonas rurales"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="target_beneficiaries">¿A quiénes beneficia tu proyecto?</label>
              <input
                id="target_beneficiaries"
                type="text"
                value={form.target_beneficiaries}
                onChange={(e) => updateForm('target_beneficiaries', e.target.value)}
                placeholder="Ej: Jóvenes de 15-24 años en comunidades indígenas de Chiapas"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="estimated_beneficiaries">¿A cuántas personas esperas impactar?</label>
              <input
                id="estimated_beneficiaries"
                type="number"
                min="1"
                value={form.estimated_beneficiaries || ''}
                onChange={(e) => updateForm('estimated_beneficiaries', parseInt(e.target.value) || 0)}
                placeholder="Un estimado está bien, lo iremos ajustando"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="budget_estimated">¿Tienes un presupuesto estimado? (MXN, opcional)</label>
              <input
                id="budget_estimated"
                type="number"
                min="0"
                value={form.budget_estimated || ''}
                onChange={(e) => updateForm('budget_estimated', parseInt(e.target.value) || 0)}
                placeholder="Si aún no lo sabes, déjalo vacío. Te ayudamos después."
              />
            </div>
          </div>
        )}

        {/* Step 3: Location & Team */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h2>¿Dónde sucede la magia?</h2>
            <p className={styles.stepHint}>Conocer tu contexto nos ayuda a conectarte con los recursos y aliados correctos.</p>
            <div className={styles.field}>
              <label htmlFor="location_state">¿En qué estado operas?</label>
              <select
                id="location_state"
                value={form.location_state}
                onChange={(e) => updateForm('location_state', e.target.value)}
                required
              >
                <option value="">Selecciona tu estado</option>
                {mexicanStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="location_city">Ciudad o municipio</label>
              <input
                id="location_city"
                type="text"
                value={form.location_city}
                onChange={(e) => updateForm('location_city', e.target.value)}
                placeholder="¿En qué comunidad estás trabajando?"
              />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="start_date">¿Cuándo arrancas (o arrancaste)?</label>
                <input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => updateForm('start_date', e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="end_date">¿Cuándo esperas completarlo?</label>
                <input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => updateForm('end_date', e.target.value)}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="team_size">¿Cuántas personas son en tu equipo?</label>
              <input
                id="team_size"
                type="number"
                min="1"
                value={form.team_size}
                onChange={(e) => updateForm('team_size', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        )}

        {/* Step 4: ODS */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <h2>¿Con qué sueñas para México?</h2>
            <p className={styles.stepHint}>
              Selecciona los Objetivos de Desarrollo Sostenible que tu proyecto impulsa. 
              Esto nos ayuda a conectarte con la comunidad y recursos correctos.
            </p>
            <div className={styles.odsGrid}>
              {odsGoals.map(ods => (
                <button
                  key={ods.id}
                  type="button"
                  className={`${styles.odsBtn} ${form.ods_goals.includes(ods.id) ? styles.odsActive : ''}`}
                  onClick={() => toggleOds(ods.id)}
                >
                  {ods.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className={styles.actions}>
          {step > 1 && (
            <button type="button" className={styles.backBtn} onClick={() => setStep(step - 1)}>
              Anterior
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              className={styles.nextBtn}
              onClick={() => setStep(step + 1)}
              disabled={!validateStep(step)}
            >
              Siguiente
            </button>
          ) : (
            <button type="button" className={styles.submitBtn} disabled={saving} onClick={handleSubmit}>
              {saving ? 'Registrando tu proyecto...' : '🚀 Lanzar mi proyecto'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
