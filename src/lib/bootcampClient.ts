import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Cliente Supabase perezoso y aislado para el formulario del bootcamp.
//
// Motivo: la landing pública se renderiza sin sesión y debe cargar SIEMPRE,
// aunque las variables de entorno de Supabase falten o sean inválidas en el
// build de producción. Por eso NO creamos el cliente al importar el módulo
// (eso podría lanzar y dejar la página en blanco); lo creamos solo cuando el
// usuario envía el formulario, y devolvemos null si no hay credenciales.

let cached: SupabaseClient | null | undefined;

export function getBootcampClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const isValid =
    !!url &&
    !!anonKey &&
    url.startsWith('http') &&
    // Evita los valores placeholder del .env.example
    !url.includes('tu-proyecto') &&
    !anonKey.includes('tu-anon-key');

  if (!isValid) {
    console.warn(
      '[bootcamp] Supabase no está configurado; el registro no se guardará.'
    );
    cached = null;
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cached = createClient<any>(url, anonKey);
  } catch (err) {
    console.error('[bootcamp] No se pudo inicializar Supabase:', err);
    cached = null;
  }

  return cached;
}
