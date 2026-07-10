import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { validateReflection } from '../../lib/missions';
import styles from './ReflectionForm.module.css';

interface ReflectionFormProps {
  missionId: string;
  onSubmitSuccess: () => void;
}

export default function ReflectionForm({
  missionId,
  onSubmitSuccess,
}: ReflectionFormProps) {
  const [text, setText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = text.length >= 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateReflection(text);
    if (!validation.valid) {
      setValidationError(validation.error ?? null);
      return;
    }

    setValidationError(null);
    setSubmitError(null);
    setIsSubmitting(true);

    const { error } = await supabase.rpc('complete_mission', {
      p_mission_id: missionId,
      p_reflection: text,
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError('Error al completar la misión. Intenta de nuevo.');
      return;
    }

    onSubmitSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.textareaWrapper}>
        <textarea
          className={styles.textarea}
          placeholder="Escribe tu reflexión sobre cómo aplicas esta lección a tu proyecto..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (validationError && e.target.value.length >= 50) {
              setValidationError(null);
            }
          }}
          disabled={isSubmitting}
          aria-label="Reflexión"
        />
      </div>

      <p
        className={`${styles.charCounter} ${isValid ? styles.charCounterValid : ''}`}
      >
        {text.length}/50 caracteres mínimo
      </p>

      {validationError && (
        <p className={styles.validationError}>{validationError}</p>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Completando...' : 'Completar Misión'}
      </button>

      {submitError && <p className={styles.submitError}>{submitError}</p>}
    </form>
  );
}
