'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ConfirmPage() {
  const params = useSearchParams();
  const [state, setState] = useState({
    status: 'loading',
    title: 'Conferma in corso…',
    message: 'Stiamo attivando il tuo account Lagoon Rebel Wear.'
  });

  useEffect(() => {
    const run = async () => {
      try {
        // Nuovo formato Supabase: ?code=...
        const code = params.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession({ code });
          if (error) throw error;
          setState({
            status: 'ok',
            title: 'Registrazione completata!',
            message: 'Benvenuto in Lagoon Rebel Wear. Ti reindirizziamo al tuo account…'
          });
          setTimeout(() => (window.location.href = '/account'), 1200);
          return;
        }

        // Fallback per vecchi link con hash
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const hash = new URLSearchParams(window.location.hash.slice(1));
          const access_token = hash.get('access_token');
          const refresh_token = hash.get('refresh_token');
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
            setState({
              status: 'ok',
              title: 'Registrazione completata!',
              message: 'Benvenuto in Lagoon Rebel Wear. Ti reindirizziamo al tuo account…'
            });
            setTimeout(() => (window.location.href = '/account'), 1200);
            return;
          }
        }

        setState({
          status: 'error',
          title: 'Link non valido o scaduto',
          message: 'Richiedi una nuova conferma o riprova ad accedere.'
        });
      } catch (e) {
        setState({
          status: 'error',
          title: 'Errore durante la conferma',
          message: e.message || 'Si è verificato un errore inatteso.'
        });
      }
    };
    run();
  }, [params]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold">{state.title}</h1>
        <p className={`${state.status === 'error' ? 'text-red-400' : 'text-white/80'} mt-3`}>
          {state.message}
        </p>

        {state.status === 'error' && (
          <div className="mt-6 flex flex-col gap-3">
            <a href="/login" className="px-5 py-2 rounded-md bg-white text-black font-semibold">Accedi</a>
            <a href="/signup" className="px-5 py-2 rounded-md border border-white/30">Crea un nuovo account</a>
          </div>
        )}
      </div>
    </main>
  );
}
