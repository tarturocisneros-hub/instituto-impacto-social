import { useState, useCallback } from 'react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Calendar, Clock, MapPin, Loader2, GraduationCap } from 'lucide-react';
import { getBootcampClient } from '../../lib/bootcampClient';
import { bootcampInfo, bootcampProjectTypes } from './data';
import styles from './BootcampSection.module.css';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  cause: string;
  projectType: string;
}

const initialForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  cause: '',
  projectType: '',
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// MODO DE PRUEBA: simula el envío sin escribir en Supabase.
// Ponlo en `true` para probar la UI sin base de datos.
const DEMO_MODE = false;

export default function BootcampSection() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const validate = useCallback((values: FormState) => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!values.fullName.trim()) next.fullName = 'Ingresa tu nombre completo.';
    if (!values.email.trim()) {
      next.email = 'Ingresa tu correo electrónico.';
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      next.email = 'Ingresa un correo electrónico válido.';
    }
    if (!values.phone.trim()) next.phone = 'Ingresa un número de contacto.';
    if (!values.cause.trim()) next.cause = 'Cuéntanos cuál es tu causa.';
    if (!values.projectType) next.projectType = 'Selecciona una opción.';
    return next;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError('');

      const validationErrors = validate(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setStatus('submitting');

      try {
        if (DEMO_MODE) {
          // Simula la latencia de red y responde con éxito sin tocar Supabase.
          await new Promise((resolve) => setTimeout(resolve, 800));
          console.info('[DEMO_MODE] Registro simulado:', {
            full_name: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            cause: form.cause.trim(),
            project_type: form.projectType,
            location: 'Veracruz',
          });
          setStatus('success');
          setForm(initialForm);
          return;
        }

        const client = getBootcampClient();
        if (!client) {
          throw new Error('Supabase no está configurado en este entorno.');
        }

        const { error } = await client.from('bootcamp_registrations').insert({
          full_name: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          cause: form.cause.trim(),
          project_type: form.projectType,
          location: 'Veracruz',
          created_at: new Date().toISOString(),
        });

        if (error) throw error;

        setStatus('success');
        setForm(initialForm);
      } catch (err) {
        console.error('Bootcamp registration failed:', err);
        setStatus('error');
        setSubmitError(
          'No pudimos completar tu registro en este momento. Intenta de nuevo o escríbenos a contacto@impactosocialmexico.org.'
        );
      }
    },
    [form, validate]
  );

  const resetForm = useCallback(() => {
    setStatus('idle');
    setSubmitError('');
    setErrors({});
  }, []);

  return (
    <section
      id="bootcamp"
      className={styles.section}
      aria-label="Registro al Bootcamp de Emprendimiento Social"
    >
      <div className={styles.container}>
        {/* Info column */}
        <div className={styles.info}>
          <span className={styles.badge}>Inscripciones abiertas · Veracruz</span>
          <h2 className={styles.heading}>{bootcampInfo.title}</h2>
          <p className={styles.subtitle}>{bootcampInfo.subtitle}</p>

          <ul className={styles.meta}>
            <li className={styles.metaItem}>
              <Calendar size={18} aria-hidden="true" />
              <span>{bootcampInfo.startDate}</span>
            </li>
            <li className={styles.metaItem}>
              <Clock size={18} aria-hidden="true" />
              <span>{bootcampInfo.duration}</span>
            </li>
            <li className={styles.metaItem}>
              <MapPin size={18} aria-hidden="true" />
              <span>{bootcampInfo.modality}</span>
            </li>
          </ul>

          <ul className={styles.benefits}>
            {bootcampInfo.benefits.map((benefit) => {
              const IconComponent = Icons[
                benefit.icon as keyof typeof Icons
              ] as LucideIcon | undefined;
              return (
                <li key={benefit.text} className={styles.benefit}>
                  <span className={styles.benefitIcon} aria-hidden="true">
                    {IconComponent ? <IconComponent size={18} /> : null}
                  </span>
                  <span>{benefit.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Form column */}
        <div className={styles.formCard}>
          {status === 'success' ? (
            <div className={styles.successState} role="status">
              <CheckCircle2 size={48} className={styles.successIcon} aria-hidden="true" />
              <h3 className={styles.successTitle}>¡Registro recibido!</h3>
              <p className={styles.successText}>
                Gracias por tu interés en el Bootcamp de Emprendimiento Social en
                Veracruz. Nuestro equipo te contactará por correo con los
                siguientes pasos.
              </p>
              <button type="button" className={styles.secondaryBtn} onClick={resetForm}>
                Registrar a otra persona
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <h3 className={styles.formTitle}>Regístrate al bootcamp</h3>
              <p className={styles.formLead}>
                Déjanos tus datos y te enviaremos toda la información.
              </p>

              <div className={styles.scholarship}>
                <GraduationCap size={22} aria-hidden="true" />
                <span>
                  Regístrate para obtener una <strong>beca del 100%</strong>
                </span>
              </div>

              <div className={styles.field}>
                <label htmlFor="fullName" className={styles.label}>
                  Nombre completo <span className={styles.required}>*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={styles.input}
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                />
                {errors.fullName && (
                  <span id="fullName-error" className={styles.errorText}>
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>
                    Teléfono <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={styles.input}
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <span id="phone-error" className={styles.errorText}>
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>
                    Correo electrónico <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <span id="email-error" className={styles.errorText}>
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="cause" className={styles.label}>
                  ¿Cuál es tu causa? <span className={styles.required}>*</span>{' '}
                  <span className={styles.labelHint}>
                    (sé específico, descríbela a detalle)
                  </span>
                </label>
                <textarea
                  id="cause"
                  name="cause"
                  className={styles.textarea}
                  rows={3}
                  placeholder="Describe a detalle la causa social que te mueve: qué problema quieres resolver, a quién impacta y por qué te importa."
                  value={form.cause}
                  onChange={handleChange}
                  maxLength={500}
                  aria-invalid={!!errors.cause}
                  aria-describedby={errors.cause ? 'cause-error' : undefined}
                />
                {errors.cause && (
                  <span id="cause-error" className={styles.errorText}>
                    {errors.cause}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="projectType" className={styles.label}>
                  ¿Qué tipo de proyecto tienes o te gustaría desarrollar?{' '}
                  <span className={styles.required}>*</span>
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  className={styles.input}
                  value={form.projectType}
                  onChange={handleChange}
                  aria-invalid={!!errors.projectType}
                  aria-describedby={
                    errors.projectType ? 'projectType-error' : undefined
                  }
                >
                  <option value="">Selecciona una opción</option>
                  {bootcampProjectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <span id="projectType-error" className={styles.errorText}>
                    {errors.projectType}
                  </span>
                )}
              </div>

              {submitError && (
                <p className={styles.submitError} role="alert">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} aria-hidden="true" />
                    Enviando...
                  </>
                ) : (
                  'Enviar registro'
                )}
              </button>

              <p className={styles.disclaimer}>
                Al enviar aceptas que el Instituto de Impacto Social México te
                contacte con información del programa.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
