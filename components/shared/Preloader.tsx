"use client";

import { useState, useEffect } from "react";
import LoadingSplash from "./LoadingSplash";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const markLoaded = () => requestAnimationFrame(() => setLoaded(true));
    // Ocultamos el splash cuando el DOM esta listo, no cuando termina de
    // cargar cada imagen: esperar "load" (fotos del hero + logos externos)
    // retrasa el LCP y deja el contenido en opacity-0 demasiado tiempo.
    // El timeout es una red de seguridad para que nunca quede trabado.
    const timeout = setTimeout(markLoaded, 2000);
    if (document.readyState !== "loading") {
      markLoaded();
    } else {
      document.addEventListener("DOMContentLoaded", markLoaded, { once: true });
    }
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("DOMContentLoaded", markLoaded);
    };
  }, []);

  return (
    <>
      {!loaded && <LoadingSplash />}
      <div
        className={`transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </>
  );
}
