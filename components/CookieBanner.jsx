'use client';
import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lrw-consent');
    if (!consent) setShow(true);

    // ascolta richiesta di riapertura dal footer
    const openHandler = () => setShow(true);
    window.addEventListener('lrw-open-consent', openHandler);
    return () => window.removeEventListener('lrw-open-consent', openHandler);
  }, []);

  const acceptAll = () => {
    localStorage.setItem('lrw-consent', JSON.stringify({ analytics: true, marketing: true }));
    setShow(false);
    // TODO: carica qui gli script non essenziali solo dopo il consenso
  };

  const rejectAll = () => {
    localStorage.setItem('lrw-consent', JSON.stringify({ analytics: false, marketing: false }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 z-50 max-w-md bg-white text-black rounded-xl shadow-lg p-4">
      <p className="text-sm">
        Usiamo cookie per migliorare l’esperienza. Puoi accettare o rifiutare.
        Leggi la <a href="/cookies" className="underline">Cookie Policy</a>.
      </p>
      <div className="mt-3 flex gap-2 justify-end">
        <button onClick={rejectAll} className="px-3 py-2 rounded-md border">Rifiuta</button>
        <button onClick={acceptAll} className="px-3 py-2 rounded-md bg-black text-white">Accetta</button>
      </div>
    </div>
  );
}
