"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE_CONFIG } from "@/constants/site";
import { Check, Send, ArrowLeft, Car, Bike, AlertCircle } from "lucide-react";
import { MOTO_BRANDS } from "@/constants/vehicles";
import {
  calculateAutoMotoQuote,
  formatPriceARS,
  type CoverageTier,
  type FranquiciaPct,
} from "@/lib/pricing";
import type {
  VehicleBrandOption,
  VehicleModelOption,
  VehicleVersionOption,
} from "@/lib/vehicle-valuation";
import PriceComparison from "./PriceComparison";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) =>
  String(CURRENT_YEAR - i),
);

const TOTAL_STEPS = 5;

const inputClass =
  "focus:border-brand-accent/50 focus:ring-brand-accent/10 w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-colors outline-none placeholder:text-gray-500 focus:ring-2";

async function fetchVehicleLookup<T>(params: Record<string, string>): Promise<T> {
  const res = await fetch(`/api/vehicle-lookup?${new URLSearchParams(params)}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error consultando el vehiculo");
  return json.data as T;
}

export default function Cotizador() {
  const [step, setStep] = useState(0);
  const [vehicleType, setVehicleType] = useState<"Auto" | "Moto" | "">("");

  // Moto: seleccion por lista estatica (no hay API de valuacion de motos en AR).
  const [motoBrand, setMotoBrand] = useState("");
  const [motoModel, setMotoModel] = useState("");
  const [motoYear, setMotoYear] = useState("");

  // Auto: seleccion contra Arg Autos API, con valor de mercado real.
  const [autoBrands, setAutoBrands] = useState<VehicleBrandOption[]>([]);
  const [autoModels, setAutoModels] = useState<VehicleModelOption[]>([]);
  const [autoVersions, setAutoVersions] = useState<VehicleVersionOption[]>([]);
  const [autoBrandId, setAutoBrandId] = useState<number | "">("");
  const [autoModelId, setAutoModelId] = useState<number | "">("");
  const [autoVersionId, setAutoVersionId] = useState<number | "">("");
  const [autoYear, setAutoYear] = useState("");
  const [vehicleValueARS, setVehicleValueARS] = useState<number | null>(null);
  const [lookupError, setLookupError] = useState("");
  const loadingValue = Boolean(autoVersionId) && vehicleValueARS === null && !lookupError;

  const [hasGnc, setHasGnc] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [franquiciaPct, setFranquiciaPct] = useState<FranquiciaPct>(0);
  const [selectedTier, setSelectedTier] = useState<CoverageTier | "">("");
  const [submitting, setSubmitting] = useState(false);

  const selectedMotoBrandModels =
    MOTO_BRANDS.find((b) => b.name === motoBrand)?.models ?? [];
  const selectedAutoBrandName = autoBrands.find((b) => b.id === autoBrandId)?.name ?? "";
  const selectedAutoModelName = autoModels.find((m) => m.id === autoModelId)?.name ?? "";

  const brand = vehicleType === "Auto" ? selectedAutoBrandName : motoBrand;
  const model = vehicleType === "Auto" ? selectedAutoModelName : motoModel;
  const year = vehicleType === "Auto" ? autoYear : motoYear;

  // Carga las marcas de auto una sola vez al elegir "Auto".
  useEffect(() => {
    if (vehicleType !== "Auto" || autoBrands.length > 0) return;
    let active = true;
    fetchVehicleLookup<VehicleBrandOption[]>({ action: "brands" })
      .then((data) => {
        if (!active) return;
        setAutoBrands(data);
        setLookupError("");
      })
      .catch((err) => active && setLookupError(err.message));
    return () => {
      active = false;
    };
  }, [vehicleType, autoBrands.length]);

  // Carga modelos al elegir marca y año de auto (solo modelos con ese año-modelo).
  useEffect(() => {
    if (!autoBrandId || !autoYear) return;
    let active = true;
    fetchVehicleLookup<VehicleModelOption[]>({
      action: "models",
      brandId: String(autoBrandId),
      year: autoYear,
    })
      .then((data) => {
        if (!active) return;
        setAutoModels(data);
        setLookupError("");
      })
      .catch((err) => active && setLookupError(err.message));
    return () => {
      active = false;
    };
  }, [autoBrandId, autoYear]);

  // Carga versiones al elegir modelo de auto, filtradas por el año elegido.
  useEffect(() => {
    if (!autoModelId || !autoYear) return;
    let active = true;
    fetchVehicleLookup<VehicleVersionOption[]>({
      action: "versions",
      modelId: String(autoModelId),
      year: autoYear,
    })
      .then((data) => {
        if (!active) return;
        setAutoVersions(data);
        setLookupError("");
      })
      .catch((err) => active && setLookupError(err.message));
    return () => {
      active = false;
    };
  }, [autoModelId, autoYear]);

  // Consulta el valor de mercado real al elegir version de auto, para el año elegido.
  useEffect(() => {
    if (!autoVersionId || !autoYear) return;
    let active = true;
    fetchVehicleLookup<number>({
      action: "value",
      versionId: String(autoVersionId),
      year: autoYear,
    })
      .then((data) => {
        if (!active) return;
        setVehicleValueARS(data);
        setLookupError("");
      })
      .catch((err) => active && setLookupError(err.message));
    return () => {
      active = false;
    };
  }, [autoVersionId, autoYear]);

  const quote = useMemo(() => {
    if (!vehicleType || !brand || !model || !year || !postalCode) return null;
    if (vehicleType === "Auto" && !vehicleValueARS) return null;
    return calculateAutoMotoQuote(
      {
        vehicleType,
        brand,
        model,
        year,
        hasGnc,
        postalCode,
        vehicleValueARS: vehicleValueARS ?? undefined,
      },
      franquiciaPct,
    );
  }, [vehicleType, brand, model, year, hasGnc, postalCode, vehicleValueARS, franquiciaPct]);

  const selectedTierPrice = quote?.tiers.find((t) => t.tier === selectedTier);

  const step1Complete =
    vehicleType === "Auto"
      ? Boolean(
          autoBrandId && autoModelId && autoVersionId && autoYear && vehicleValueARS && postalCode,
        )
      : Boolean(motoBrand && motoModel && motoYear && postalCode);

  const handleNext = () => {
    if (step === 0 && vehicleType) setStep(1);
    else if (step === 1 && step1Complete) setStep(2);
    else if (step === 2 && selectedTier) setStep(3);
    else if (step === 3 && name && phone) setStep(4);
  };

  const buildMessage = () => {
    const label = vehicleType === "Moto" ? "moto" : "auto";
    let text = `Hola, quiero cotizar un seguro de ${label}.`;
    text += ` Marca: ${brand}, Modelo: ${model}, Año: ${year}`;
    if (hasGnc) text += ", Tiene GNC";
    text += ".";
    if (selectedTierPrice) {
      text += ` Cobertura elegida: ${selectedTierPrice.label} - estimado ${formatPriceARS(selectedTierPrice.monthlyPrice)}/mes`;
      if (selectedTier === "todo-riesgo") text += ` (franquicia ${franquiciaPct}%)`;
      text += ".";
    }
    text += ` CP: ${postalCode}. Nombre: ${name}, Email: ${email || "-"}, Tel: ${phone}`;
    return text;
  };

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=${encodeURIComponent(buildMessage())}`,
      "_blank",
    );

    setSubmitting(true);
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email: email || undefined,
        cobertura: "Automotor",
        message: buildMessage(),
        source: "web-cotizador",
        details: {
          vehicleType,
          brand,
          model,
          year,
          hasGnc,
          postalCode,
          selectedTier: selectedTier || undefined,
          franquiciaPct: selectedTier === "todo-riesgo" ? franquiciaPct : undefined,
          estimatedPrice: selectedTierPrice?.monthlyPrice,
          quote: quote?.tiers.map((t) => ({
            tier: t.tier,
            label: t.label,
            monthlyPrice: t.monthlyPrice,
          })),
        },
      }),
    })
      .catch((err) => console.error("No se pudo guardar el lead", err))
      .finally(() => setSubmitting(false));
  };

  const reset = () => {
    setStep(0);
    setVehicleType("");
    setMotoBrand("");
    setMotoModel("");
    setMotoYear("");
    setAutoBrandId("");
    setAutoModelId("");
    setAutoVersionId("");
    setAutoYear("");
    setAutoModels([]);
    setAutoVersions([]);
    setVehicleValueARS(null);
    setLookupError("");
    setHasGnc(false);
    setPostalCode("");
    setName("");
    setEmail("");
    setPhone("");
    setFranquiciaPct(0);
    setSelectedTier("");
  };

  return (
    <div className="border border-gray-200 bg-white p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="hover:border-brand-accent hover:text-brand-accent flex h-8 w-8 items-center justify-center border border-gray-200 text-gray-600 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-gray-400">/</span>}
              <span className={step >= i ? "text-brand-accent" : ""}>
                {i + 1}
              </span>
            </span>
          ))}
        </div>
      </div>

      {step === 0 && (
        <div>
          <h3 className="text-brand-dark text-lg font-bold">
            Que vehiculo queres asegurar?
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Cotizamos seguro de auto y moto. Para otro tipo de cobertura, un
            asesor te va a ayudar directamente.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {(["Auto", "Moto"] as const).map((v) => {
              const Icon = v === "Auto" ? Car : Bike;
              return (
                <button
                  key={v}
                  onClick={() => setVehicleType(v)}
                  className={`flex flex-col items-center gap-2 border px-4 py-6 text-sm font-semibold transition-colors ${
                    vehicleType === v
                      ? "border-brand-accent bg-brand-accent-soft text-brand-accent"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {v}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleNext}
            disabled={!vehicleType}
            className="bg-brand-accent hover:bg-brand-accent-hover mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h3 className="text-brand-dark text-lg font-bold">
            Datos del vehiculo
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {vehicleType === "Auto"
              ? "Buscamos el valor de mercado real de tu auto para una cotizacion mas precisa."
              : "Contanos las caracteristicas de tu moto para una cotizacion precisa."}
          </p>

          {lookupError && (
            <div className="mt-4 flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {lookupError}
            </div>
          )}

          <div className="mt-5 space-y-4">
            {vehicleType === "Auto" ? (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Marca
                  </label>
                  <select
                    value={autoBrandId}
                    onChange={(e) => {
                      setAutoBrandId(e.target.value ? Number(e.target.value) : "");
                      setAutoYear("");
                      setAutoModelId("");
                      setAutoVersionId("");
                      setAutoModels([]);
                      setAutoVersions([]);
                      setVehicleValueARS(null);
                      setLookupError("");
                    }}
                    className={inputClass}
                    disabled={autoBrands.length === 0}
                  >
                    <option value="">
                      {autoBrands.length === 0 ? "Cargando marcas..." : "Selecciona una marca"}
                    </option>
                    {autoBrands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <AnimatePresence>
                  {autoBrandId && (
                    <motion.div
                      key="anio"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Año
                      </label>
                      <select
                        value={autoYear}
                        onChange={(e) => {
                          setAutoYear(e.target.value);
                          setAutoModelId("");
                          setAutoVersionId("");
                          setAutoModels([]);
                          setAutoVersions([]);
                          setVehicleValueARS(null);
                          setLookupError("");
                        }}
                        className={inputClass}
                      >
                        <option value="">Selecciona</option>
                        {YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {autoYear && (
                    <motion.div
                      key="modelo"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Modelo
                      </label>
                      <select
                        value={autoModelId}
                        onChange={(e) => {
                          setAutoModelId(e.target.value ? Number(e.target.value) : "");
                          setAutoVersionId("");
                          setAutoVersions([]);
                          setVehicleValueARS(null);
                          setLookupError("");
                        }}
                        className={inputClass}
                        disabled={autoModels.length === 0}
                      >
                        <option value="">
                          {autoModels.length === 0 ? "Cargando modelos..." : "Selecciona"}
                        </option>
                        {autoModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {autoModelId && (
                    <motion.div
                      key="version"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Versión
                      </label>
                      <select
                        value={autoVersionId}
                        onChange={(e) => {
                          setAutoVersionId(e.target.value ? Number(e.target.value) : "");
                          setVehicleValueARS(null);
                          setLookupError("");
                        }}
                        className={inputClass}
                        disabled={autoVersions.length === 0}
                      >
                        <option value="">
                          {autoVersions.length === 0 ? "Cargando versiones..." : "Selecciona"}
                        </option>
                        {autoVersions.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1.5 text-xs text-gray-500">
                        El año que aparece en el nombre de cada versión es el de su
                        lanzamiento, no siempre coincide con el año que elegiste: es
                        normal si tu modelo no tuvo una versión nueva ese año.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {autoVersionId && loadingValue && (
                    <motion.div
                      key="valor"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center justify-center border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <span className="border-brand-accent/60 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Marca
                  </label>
                  <select
                    value={motoBrand}
                    onChange={(e) => {
                      setMotoBrand(e.target.value);
                      setMotoModel("");
                    }}
                    className={inputClass}
                  >
                    <option value="">Selecciona una marca</option>
                    {MOTO_BRANDS.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <AnimatePresence>
                  {motoBrand && (
                    <motion.div
                      key="modelo-anio"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Modelo
                        </label>
                        <select
                          value={motoModel}
                          onChange={(e) => setMotoModel(e.target.value)}
                          className={inputClass}
                        >
                          <option value="">Selecciona</option>
                          {selectedMotoBrandModels.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Año
                        </label>
                        <select
                          value={motoYear}
                          onChange={(e) => setMotoYear(e.target.value)}
                          className={inputClass}
                        >
                          <option value="">Selecciona</option>
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            <AnimatePresence>
              {model && (vehicleType === "Auto" ? autoVersionId && autoYear : motoYear) && (
                <motion.div
                  key="cp-gnc"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                      Codigo Postal
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 3000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  {vehicleType === "Auto" && (
                    <label className="flex cursor-pointer items-center gap-3 border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={hasGnc}
                        onChange={(e) => setHasGnc(e.target.checked)}
                        className="text-brand-accent accent-brand-accent h-4 w-4"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Tiene equipo GNC
                      </span>
                    </label>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={handleNext}
            disabled={!step1Complete}
            className="bg-brand-accent hover:bg-brand-accent-hover mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {step === 2 && quote && (
        <div>
          <PriceComparison
            quote={quote}
            franquiciaPct={franquiciaPct}
            onFranquiciaChange={(pct) => setFranquiciaPct(pct as FranquiciaPct)}
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
          />
          <button
            onClick={handleNext}
            disabled={!selectedTier}
            className="bg-brand-accent hover:bg-brand-accent-hover mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-brand-dark text-lg font-bold">Tus datos</h3>
          <p className="mt-1 text-sm text-gray-600">
            Dejanos tu informacion para enviarte la cotizacion.
          </p>
          <div className="mt-5 space-y-4">
            <input
              type="text"
              placeholder="Nombre y apellido"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Email (opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              type="tel"
              placeholder="Telefono / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            onClick={handleNext}
            disabled={!name || !phone}
            className="bg-brand-accent hover:bg-brand-accent-hover mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-40"
          >
            Cotizar ahora
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center">
          <div className="bg-brand-accent-soft mx-auto flex h-14 w-14 items-center justify-center rounded-full">
            <Check className="text-brand-accent h-6 w-6" />
          </div>
          <h3 className="text-brand-dark mt-4 text-lg font-bold">
            Listo, {name}!
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Vamos a enviarte la cotizacion de tu seguro de{" "}
            <span className="text-brand-dark font-semibold">
              {vehicleType.toLowerCase()}
            </span>{" "}
            por WhatsApp.
          </p>
          <div className="mt-4 border border-gray-200 bg-gray-50 p-3 text-left text-xs text-gray-600">
            <p>
              {brand} {model} - {year}
            </p>
            {hasGnc && <p>Con GNC</p>}
            <p>CP: {postalCode}</p>
            {selectedTierPrice && (
              <p className="text-brand-dark mt-1 font-semibold">
                {selectedTierPrice.label}: {formatPriceARS(selectedTierPrice.monthlyPrice)}/mes aprox.
              </p>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleWhatsApp}
              disabled={submitting}
              className="bg-whatsapp inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              Enviar por WhatsApp
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 px-8 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300"
            >
              Cotizar otro seguro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
