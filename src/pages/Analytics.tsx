import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import styles from './Analytics.module.css';

// Quiz Supabase connection (different project)
const quizSupabase = createClient(
  'https://tvyxrjustjiiitvvafdi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXhyanVzdGppaWl0dnZhZmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDQ1MzgsImV4cCI6MjEwMDgyMDUzOH0.mH4Nz14ZzVbZP8Vk3LFtgqt4q1ilMg3--WBn7R9LHfo'
);

interface QuizResponse {
  id: string;
  tipo_negocio: string;
  estado: string;
  ciudad: string;
  puntaje_total: number;
  nivel: string;
  respuestas: { question: number; points: number }[];
  created_at: string;
}

const questionTitles = [
  '1. ADN del producto',
  '2. Materiales e insumos',
  '3. Origen del talento',
  '4. Inclusión laboral',
  '5. Cadena de suministro local',
  '6. Cuidado ambiental',
  '7. Economía circular',
  '8. Bienestar y familia',
  '9. Acción comunitaria',
  '10. Liderazgo de barrio',
  '11. Vinculación local',
];

export default function Analytics() {
  const { profile } = useAuth();
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data, error } = await quizSupabase
      .from('quiz_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setResponses(data as QuizResponse[]);
    }
    setLoading(false);
  }

  // Only admin can see this page
  if (profile?.role !== 'admin') {
    return (
      <div className={styles.page}>
        <h1>Acceso restringido</h1>
        <p>Solo administradores pueden ver esta página.</p>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.page}><p>Cargando datos...</p></div>;
  }

  // Calculate stats per question
  const questionStats = questionTitles.map((title, idx) => {
    const questionNum = idx + 1;
    let total3 = 0, total2 = 0, total1 = 0, count = 0;

    responses.forEach((r) => {
      const answer = r.respuestas?.find((a) => a.question === questionNum);
      if (answer) {
        count++;
        if (answer.points === 3) total3++;
        else if (answer.points === 2) total2++;
        else total1++;
      }
    });

    return { title, total3, total2, total1, count };
  });

  // Level distribution
  const levelCounts: Record<string, number> = {};
  responses.forEach((r) => {
    levelCounts[r.nivel] = (levelCounts[r.nivel] || 0) + 1;
  });

  // Top states
  const stateCounts: Record<string, number> = {};
  responses.forEach((r) => {
    if (r.estado) stateCounts[r.estado] = (stateCounts[r.estado] || 0) + 1;
  });
  const topStates = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className={styles.page}>
      <h1>📊 Analytics del Quiz</h1>
      <p className={styles.subtitle}>{responses.length} respuestas totales</p>

      {/* Level Distribution */}
      <section className={styles.section}>
        <h2>Distribución por Nivel</h2>
        <div className={styles.levelGrid}>
          {Object.entries(levelCounts).map(([nivel, count]) => (
            <div key={nivel} className={styles.levelCard}>
              <span className={styles.levelCount}>{count}</span>
              <span className={styles.levelName}>{nivel}</span>
              <span className={styles.levelPercent}>
                {Math.round((count / responses.length) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Per Question Breakdown */}
      <section className={styles.section}>
        <h2>Respuestas por Pregunta</h2>
        <div className={styles.questionsGrid}>
          {questionStats.map((q) => (
            <div key={q.title} className={styles.questionCard}>
              <h3 className={styles.questionTitle}>{q.title}</h3>
              <div className={styles.bars}>
                <div className={styles.barRow}>
                  <span className={styles.barLabel}>A (alto)</span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${styles.barHigh}`}
                      style={{ width: q.count ? `${(q.total3 / q.count) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className={styles.barValue}>{q.total3}</span>
                </div>
                <div className={styles.barRow}>
                  <span className={styles.barLabel}>B (medio)</span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${styles.barMedium}`}
                      style={{ width: q.count ? `${(q.total2 / q.count) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className={styles.barValue}>{q.total2}</span>
                </div>
                <div className={styles.barRow}>
                  <span className={styles.barLabel}>C (bajo)</span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${styles.barLow}`}
                      style={{ width: q.count ? `${(q.total1 / q.count) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className={styles.barValue}>{q.total1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top States */}
      <section className={styles.section}>
        <h2>Top Estados</h2>
        <div className={styles.statesList}>
          {topStates.map(([estado, count]) => (
            <div key={estado} className={styles.stateRow}>
              <span>{estado}</span>
              <span className={styles.stateCount}>{count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Responses Table */}
      <section className={styles.section}>
        <h2>Últimas respuestas</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Negocio</th>
                <th>Estado</th>
                <th>Puntaje</th>
                <th>Nivel</th>
              </tr>
            </thead>
            <tbody>
              {responses.slice(0, 20).map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleDateString('es-MX')}</td>
                  <td>{r.tipo_negocio}</td>
                  <td>{r.estado}</td>
                  <td>{r.puntaje_total}/33</td>
                  <td>{r.nivel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
