'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return <main className="min-h-[60vh] flex items-center justify-center">Caricamento…</main>;
  }

  if (!user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Non sei loggato</h1>
          <p className="mt-2">Accedi per vedere il tuo account.</p>
          <a href="/login" className="mt-4 inline-block px-4 py-2 rounded-md bg-white text-black">Accedi</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Ciao, {user.email}</h1>
        <p className="mt-2">Benvenuto nella tua area Lagoon Rebel Wear!</p>
        <button
          onClick={logout}
          className="mt-6 px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-neutral-200"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
