import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    organization: profile?.organization || '',
  });

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    setEditing(false);
  };

  if (!profile) return null;

  return (
    <div className={styles.page}>
      <h1>Mi Perfil</h1>

      <div className={styles.card}>
        <div className={styles.avatar}>
          <span>{profile.full_name.charAt(0).toUpperCase()}</span>
        </div>

        {!editing ? (
          <div className={styles.info}>
            <h2>{profile.full_name}</h2>
            <p className={styles.role}>{profile.role}</p>
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email:</span>
                <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Teléfono:</span>
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.organization && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Organización:</span>
                  <span>{profile.organization}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Nivel:</span>
                <span>{profile.level}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Puntos:</span>
                <span>{profile.points}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Miembro desde:</span>
                <span>{new Date(profile.created_at).toLocaleDateString('es-MX')}</span>
              </div>
            </div>
            <button className={styles.editBtn} onClick={() => setEditing(true)}>
              Editar Perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className={styles.editForm}>
            <div className={styles.field}>
              <label htmlFor="full_name">Nombre completo</label>
              <input
                id="full_name"
                type="text"
                value={form.full_name}
                onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="organization">Organización</label>
              <input
                id="organization"
                type="text"
                value={form.organization}
                onChange={(e) => setForm(prev => ({ ...prev, organization: e.target.value }))}
              />
            </div>
            <div className={styles.formActions}>
              <button type="button" onClick={() => setEditing(false)} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button type="submit" disabled={saving} className={styles.saveBtn}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
