"use client";

import { useState } from "react";
import { Check, Info } from "lucide-react";
import {
  FRANQUICIA_OPTIONS,
  formatPriceARS,
  type CoverageTier,
  type QuoteResult,
} from "@/lib/pricing";
import ProviderQuoteColumn, {
  PROVIDER_COLUMNS,
  type ProviderColumnInput,
} from "./ProviderQuoteColumn";

interface PriceComparisonProps {
  quote: QuoteResult;
  franquiciaPct: number;
  onFranquiciaChange: (pct: number) => void;
  selectedTier: CoverageTier | "";
  onSelectTier: (tier: CoverageTier) => void;
  // Si viene (solo Auto), se agrega una columna por cada aseguradora de
  // PROVIDER_COLUMNS con su cotizacion en linea.
  providerInput?: ProviderColumnInput;
}

export default function PriceComparison({
  quote,
  franquiciaPct,
  onFranquiciaChange,
  selectedTier,
  onSelectTier,
  providerInput,
}: PriceComparisonProps) {
  const [showWhy, setShowWhy] = useState(false);

  const tierCards = (
    <div className="space-y-3">
      {quote.tiers.map((tier) => (
        <div
          key={tier.tier}
          className={`border p-4 transition-colors ${
            selectedTier === tier.tier
              ? "border-brand-accent bg-brand-accent-soft"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-brand-dark text-sm font-bold">
              {tier.label}
            </span>
            <div className="text-right">
              <span className="text-brand-accent text-lg font-bold">
                {formatPriceARS(tier.monthlyPrice)}
              </span>
              <span className="block text-[10px] text-gray-500">
                por mes, aprox.
              </span>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-gray-600">
            {tier.benefits.map((b) => (
              <li key={b} className="flex items-start gap-1.5">
                <Check className="text-brand-accent mt-0.5 h-3 w-3 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          {tier.tier === "todo-riesgo" && (
            <div className="mt-4 bg-gray-50 p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>Franquicia</span>
                <span className="text-brand-accent">{franquiciaPct}%</span>
              </div>
              <input
                type="range"
                min={FRANQUICIA_OPTIONS[0]}
                max={FRANQUICIA_OPTIONS[FRANQUICIA_OPTIONS.length - 1]}
                step={5}
                value={franquiciaPct}
                onChange={(e) => onFranquiciaChange(Number(e.target.value))}
                className="accent-brand-accent mt-2 w-full cursor-pointer"
                aria-label="Porcentaje de franquicia"
              />
              <div className="mt-1 flex justify-between text-[10px] text-gray-500">
                {FRANQUICIA_OPTIONS.map((p) => (
                  <span key={p}>{p}%</span>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-gray-500">
                A mayor franquicia, menor la cuota mensual.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => onSelectTier(tier.tier)}
            className={`mt-4 w-full py-2 text-xs font-semibold transition-colors ${
              selectedTier === tier.tier
                ? "bg-brand-accent text-white"
                : "border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {selectedTier === tier.tier ? "Seleccionado" : "Elegir esta opción"}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h3 className="text-brand-dark text-lg font-bold">Elegí tu cobertura</h3>
      <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-600">
        <Info className="text-brand-accent mt-0.5 h-3.5 w-3.5 shrink-0" />
        Valores estimados y orientativos. Tu asesor confirma el precio y la
        cobertura exacta.
      </p>

      {providerInput ? (
        // Estimacion + aseguradoras como columnas en una fila. El grid responde
        // al ANCHO DISPONIBLE (no al viewport): auto-fit + minmax arma 3 columnas
        // cuando entran (panel ancho), baja a 2 en tablet y apila en 1 en
        // telefonos. `items-start`: cada columna queda a la altura de su
        // contenido, no estirada a lo largo de la estimacion.
        <div
          className="mt-5 grid items-start gap-4"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 15rem), 1fr))",
          }}
        >
          <div data-testid="estimate-column" className="min-w-0">
            <div className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Estimación Guadalupe
            </div>
            {tierCards}
          </div>
          {PROVIDER_COLUMNS.map((provider) => (
            <ProviderQuoteColumn
              key={provider.id}
              provider={provider}
              input={providerInput}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5">{tierCards}</div>
      )}

      <div className="mt-5 bg-gray-50 p-4">
        <button
          type="button"
          onClick={() => setShowWhy((s) => !s)}
          className="flex w-full items-center gap-2 text-left text-xs font-semibold text-gray-700"
        >
          <Info className="text-brand-accent h-3.5 w-3.5 shrink-0" />
          ¿Por qué puede variar el precio final?
        </button>
        {showWhy && (
          <p className="mt-2 text-xs leading-relaxed text-gray-600">
            Calculamos este estimado según el tipo de vehículo, la marca, el año
            y tu zona. El valor definitivo puede cambiar según la compañía
            aseguradora, el uso que le des al vehículo, tu historial de
            siniestros y las condiciones vigentes al momento de emitir la
            póliza. Por eso siempre confirmamos el detalle con vos antes de
            avanzar.
          </p>
        )}
      </div>
    </div>
  );
}
