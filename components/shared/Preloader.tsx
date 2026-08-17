"use client";

import { useState, useEffect } from "react";
import LoadingSplash from "./LoadingSplash";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(
    () => typeof document !== "undefined" && document.readyState === "complete",
  );

  useEffect(() => {
    if (loaded) return;
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [loaded]);

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
