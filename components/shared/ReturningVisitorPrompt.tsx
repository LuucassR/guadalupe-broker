"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bike, Car, RotateCcw, X } from "lucide-react";
import { formatPriceARS } from "@/lib/pricing";
import { resetConsultSession } from "@/lib/consult-session";
import {
  clearSnapshot,
  parseSnapshot,
  readSnapshotRaw,
  type VehicleSnapshot,
} from "@/lib/visitor";

// Popup "seguí donde lo dejaste": aparece cuando el navegador tiene guardado un
// vehiculo de una visita anterior (ver lib/visitor.ts). Una vez por sesion.
const DISMISSED_KEY = "gb-resume-dismissed";

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

// useSyncExternalStore necesita un valor estable: devolvemos el string crudo.
const getRaw = () => {
  try {
    if (sessionStorage.getItem(DISMISSED_KEY)) return null;
  } catch {}
  return readSnapshotRaw();
};

const relativeTime = (savedAt: number) => {
  const days = Math.round((Date.now() - savedAt) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  if (days >= 1) return rtf.format(-days, "day");
  const hours = Math.round((Date.now() - savedAt) / 3_600_000);
  return hours >= 1 ? rtf.format(-hours, "hour") : "hace un rato";
};

export default function ReturningVisitorPrompt({
  onResume,
}: {
  onResume: (snap: VehicleSnapshot) => void;
}) {
  const raw = useSyncExternalStore(subscribe, getRaw, () => null);
  const snap = useMemo(() => parseSnapshot(raw), [raw]);
  const [closed, setClosed] = useState(false);
  const primary = useRef<HTMLButtonElement>(null);
  const open = Boolean(snap) && !closed;

  const close = () => {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
    setClosed(true);
  };

  useEffect(() => {
    if (!open) return;
    primary.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const Icon = snap?.vehicleType === "Moto" ? Bike : Car;

  return (
    <AnimatePresence>
      {open && snap && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-brand-dark/60 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          data-testid="resume-prompt"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
            className="relative w-full max-w-md border border-gray-200 bg-white p-6 shadow-2xl"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Cerrar"
              className="absolute top-3 right-3 cursor-pointer p-1 text-gray-400 transition-colors hover:text-gray-700"
            >
              <X className="size-5" />
            </button>

            <p className="text-brand-accent text-xs font-semibold tracking-widest uppercase">
              ¡Qué bueno verte de nuevo!
            </p>
            <h2 id="resume-title" className="font-heading mt-1 text-xl font-semibold text-gray-900">
              Tenías una cotización en curso
            </h2>

            <div className="bg-brand-accent-soft/60 mt-5 flex items-start gap-4 border border-sky-100 p-4">
              <span className="bg-brand-accent flex size-11 shrink-0 items-center justify-center text-white">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 text-sm">
                <p className="font-heading truncate font-semibold text-gray-900">
                  {snap.brand} {snap.model}
                </p>
                {snap.version && <p className="truncate text-gray-600">{snap.version}</p>}
                <p className="mt-1 text-gray-600">
                  Año {snap.year}
                  {snap.postalCode ? ` · CP ${snap.postalCode}` : ""}
                  {snap.hasGnc ? " · con GNC" : ""}
                </p>
                {snap.valueARS ? (
                  <p className="text-gray-600">Valor de referencia {formatPriceARS(snap.valueARS)}</p>
                ) : null}
                <p className="mt-1 text-xs text-gray-400">{relativeTime(snap.savedAt)}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
              <button
                ref={primary}
                onClick={() => {
                  close();
                  onResume(snap);
                }}
                className="bg-brand-accent hover:bg-brand-accent-hover flex flex-1 cursor-pointer items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-colors"
              >
                Retomar cotización <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => {
                  clearSnapshot();
                  resetConsultSession();
                  close();
                }}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <RotateCcw className="size-4" /> Empezar de nuevo
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
