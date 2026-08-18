"use client";

import { useState, useEffect } from "react";
import LoadingSplash from "./LoadingSplash";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const markLoaded = () => requestAnimationFrame(() => setLoaded(true));
    if (document.readyState === "complete") {
      markLoaded();
      return;
    }
    window.addEventListener("load", markLoaded);
    return () => window.removeEventListener("load", markLoaded);
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
