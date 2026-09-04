"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
// Catálogo CCA: 2012+. Catálogo DNRPA (valor fiscal): 2002-2011. Autos
// anteriores a 2002 no se cotizan online — van por "no encuentro mi auto".
const OLDEST_YEAR = 2002;
const YEARS = Array.from({ length: CURRENT_YEAR - OLDEST_YEAR + 1 }, (_, i) =>
  String(CURRENT_YEAR - i),
);

// Años que resuelve la tabla DNRPA (sin nivel de versión, valor fiscal en ARS).
const isLegacyYear = (y: string | number) => {
  const n = Number(y);
  return n >= 2002 && n <= 2011;
};

// Pasos que completa el usuario (vehiculo, datos, cobertura, contacto). La
// pantalla de confirmacion final no cuenta como paso.
const TOTAL_STEPS = 4;

const POSTAL_CODE_RE = /^\d{4}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitCount = (s: string) => s.replace(/\D/g, "").length;

const inputClass =
  "focus:border-brand-accent/50 focus:ring-brand-accent/10 w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-colors outline-none placeholder:text-gray-500 focus:ring-2";

async function fetchVehicleLookup<T>(
  params: Record<string, string>,
): Promise<T> {
  const res = await fetch(`/api/vehicle-lookup?${new URLSearchParams(params)}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error consultando el vehículo");
  return json.data as T;
}

export default function Cotizador() {
  const [step, setStep] = useState(0);
  const [vehicleType, setVehicleType] = useState<"Auto" | "Moto" | "">("");

  // Moto: seleccion por lista estatica (no hay API de valuacion de motos en AR).
  const [motoBrand, setMotoBrand] = useState("");
  const [motoModel, setMotoModel] = useState("");
  const [motoYear, setMotoYear] = useState("");

  // Auto: seleccion contra el catalogo propio (CCA), con valor de mercado real.
  const [autoBrands, setAutoBrands] = useState<VehicleBrandOption[]>([]);
  const [autoModels, setAutoModels] = useState<VehicleModelOption[]>([]);
  const [autoVersions, setAutoVersions] = useState<VehicleVersionOption[]>([]);
  const [autoBrandId, setAutoBrandId] = useState<number | "">("");
  const [autoModelId, setAutoModelId] = useState<number | "">("");
  const [autoVersionId, setAutoVersionId] = useState<number | "">("");
  const [autoYear, setAutoYear] = useState("");
  const [vehicleValueARS, setVehicleValueARS] = useState<number | null>(null);
  const [lookupError, setLookupError] = useState("");
  const loadingValue =
    Boolean(autoVersionId) && vehicleValueARS === null && !lookupError;

  // Estado de carga de cada lookup. En vez de un flag "cargando" (que obligaria
  // a setState dentro del efecto), guardamos la "clave" que ya resolvio cada
  // fetch; mientras la clave actual no coincida, estamos cargando. Asi tambien
  // se distingue "cargando" de "cargo y vino vacio" (año sin datos).
  const [brandsSettled, setBrandsSettled] = useState(false);
  const [modelsSettledKey, setModelsSettledKey] = useState("");
  const [versionsSettledKey, setVersionsSettledKey] = useState("");
  const modelsKey = autoBrandId && autoYear ? `${autoBrandId}:${autoYear}` : "";
  const versionsKey =
    autoModelId && autoYear && !isLegacyYear(autoYear)
      ? `${autoModelId}:${autoYear}`
      : "";
  const loadingBrands =
    vehicleType === "Auto" && !brandsSettled && !lookupError;
  const loadingModels =
    modelsKey !== "" && modelsKey !== modelsSettledKey && !lookupError;
  const loadingVersions =
    versionsKey !== "" && versionsKey !== versionsSettledKey && !lookupError;

  // Modo manual: el auto no está en el catálogo CCA (o es anterior a los años
  // que cubre). Se cargan marca/modelo/año a mano, se saltea el comparador de
  // precios y la cotización la hace un asesor.
  const [manualVehicle, setManualVehicle] = useState(false);
  const [manualBrand, setManualBrand] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualYear, setManualYear] = useState("");

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
  const selectedAutoBrandName =
    autoBrands.find((b) => b.id === autoBrandId)?.name ?? "";
  const selectedAutoModelName =
    autoModels.find((m) => m.id === autoModelId)?.name ?? "";
  // En años < 2012 no hay paso de versión: la "versión" es el modelo DNRPA.
  const selectedAutoVersionName =
    autoVersions.find((v) => v.id === autoVersionId)?.name ??
    (isLegacyYear(autoYear) ? selectedAutoModelName : "");

  const brand = manualVehicle
    ? manualBrand.trim()
    : vehicleType === "Auto"
      ? selectedAutoBrandName
      : motoBrand;
  const model = manualVehicle
    ? manualModel.trim()
    : vehicleType === "Auto"
      ? selectedAutoModelName
      : motoModel;
  const year = manualVehicle
    ? manualYear.trim()
    : vehicleType === "Auto"
      ? autoYear
      : motoYear;

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
      .catch((err) => active && setLookupError(err.message))
      .finally(() => active && setBrandsSettled(true));
    return () => {
      active = false;
    };
  }, [vehicleType, autoBrands.length]);

  // Carga modelos al elegir marca y año de auto (solo modelos con ese año-modelo).
  useEffect(() => {
    if (!autoBrandId || !autoYear) return;
    const key = `${autoBrandId}:${autoYear}`;
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
      .catch((err) => active && setLookupError(err.message))
      .finally(() => active && setModelsSettledKey(key));
    return () => {
      active = false;
    };
  }, [autoBrandId, autoYear]);

  // Carga versiones al elegir modelo de auto, filtradas por el año elegido.
  // Años < 2012 (DNRPA) no tienen versión: se saltea.
  useEffect(() => {
    if (!autoModelId || !autoYear || isLegacyYear(autoYear)) return;
    const key = `${autoModelId}:${autoYear}`;
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
      .catch((err) => active && setLookupError(err.message))
      .finally(() => active && setVersionsSettledKey(key));
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
  }, [
    vehicleType,
    brand,
    model,
    year,
    hasGnc,
    postalCode,
    vehicleValueARS,
    franquiciaPct,
  ]);

  const selectedTierPrice = quote?.tiers.find((t) => t.tier === selectedTier);

  const postalCodeValid = POSTAL_CODE_RE.test(postalCode);
  const emailValid = email === "" || EMAIL_RE.test(email);
  const phoneValid = digitCount(phone) >= 8;
  const contactComplete = Boolean(name.trim()) && phoneValid && emailValid;

  const step1Complete = manualVehicle
    ? Boolean(
        manualBrand.trim() &&
        manualModel.trim() &&
        /^(19|20)\d{2}$/.test(manualYear.trim()) &&
        postalCodeValid,
      )
    : vehicleType === "Auto"
      ? Boolean(
          autoBrandId &&
          autoModelId &&
          autoVersionId &&
          autoYear &&
          vehicleValueARS &&
          postalCodeValid,
        )
      : Boolean(motoBrand && motoModel && motoYear && postalCodeValid);

  // El modo manual no pasa por el comparador (paso 2): va del vehículo al
  // contacto. El stepper muestra 3 puntos en vez de 4.
  const stepCount = manualVehicle ? TOTAL_STEPS - 1 : TOTAL_STEPS;
  const displayStep = manualVehicle && step >= 3 ? step - 1 : step;

  const handleNext = () => {
    if (step === 0 && vehicleType) setStep(1);
    else if (step === 1 && step1Complete) setStep(manualVehicle ? 3 : 2);
    else if (step === 2 && selectedTier) setStep(3);
    else if (step === 3 && contactComplete) setStep(4);
  };

  // Pasa a carga manual: el auto no está en el catálogo. Limpia lo que se haya
  // elegido en la búsqueda para no arrastrar un estado inconsistente.
  const enterManualVehicle = () => {
    setManualVehicle(true);
    setAutoBrandId("");
    setAutoYear("");
    setAutoModelId("");
    setAutoVersionId("");
    setAutoModels([]);
    setAutoVersions([]);
    setVehicleValueARS(null);
    setSelectedTier("");
    setLookupError("");
  };

  // Al cambiar de paso llevamos el foco al inicio del paso nuevo, para que
  // teclado y lectores de pantalla no queden en un boton que se desmonto.
  const stepRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepRef.current?.focus();
  }, [step]);

  const buildMessage = () => {
    const label = vehicleType === "Moto" ? "moto" : "auto";
    let text = `Hola, quiero cotizar un seguro de ${label}.`;
    text += ` Marca: ${brand}, Modelo: ${model}, Año: ${year}`;
    if (hasGnc) text += ", Tiene GNC";
    text += ".";
    if (manualVehicle)
      text +=
        " (Este vehículo no figura en el catálogo online, necesito que un asesor lo cotice).";
    if (selectedTierPrice) {
      text += ` Cobertura elegida: ${selectedTierPrice.label} - estimado ${formatPriceARS(selectedTierPrice.monthlyPrice)}/mes`;
      if (selectedTier === "todo-riesgo")
        text += ` (franquicia ${franquiciaPct}%)`;
      text += ".";
    }
    text += ` CP: ${postalCode}. Nombre: ${name}, Email: ${email || "-"}, Tel: ${phone}`;
    return text;
  };

  const handleWhatsApp = () => {
    const message = buildMessage();

    // Guardamos el lead primero (fire-and-forget) para no perderlo si el
    // navegador bloquea la ventana de WhatsApp.
    setSubmitting(true);
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email: email || undefined,
        cobertura: "Automotor",
        message,
        source: "web-cotizador",
        details: {
          vehicleType,
          brand,
          model,
          year,
          hasGnc,
          postalCode,
          vehicleNotInCatalog: manualVehicle || undefined,
          selectedTier: selectedTier || undefined,
          franquiciaPct:
            selectedTier === "todo-riesgo" ? franquiciaPct : undefined,
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

    window.open(
      `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=${encodeURIComponent(message)}`,
      "_blank",
    );
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
    setManualVehicle(false);
    setManualBrand("");
    setManualModel("");
    setManualYear("");
    setHasGnc(false);
    setPostalCode("");
    setName("");
    setEmail("");
    setPhone("");
    setFranquiciaPct(0);
    setSelectedTier("");
  };

  return (
    <div
      className="border border-gray-200 bg-white p-6 md:p-8"
      data-testid="cotizador"
    >
      <div className="mb-6 flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={() =>
              setStep(step === 3 && manualVehicle ? 1 : step - 1)
            }
            className="hover:border-brand-accent hover:text-brand-accent flex h-8 w-8 cursor-pointer items-center justify-center border border-gray-200 text-gray-600 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div
          className="flex items-center gap-2 text-sm font-medium text-gray-500"
          role="group"
          aria-label={`Paso ${Math.min(displayStep + 1, stepCount)} de ${stepCount}`}
        >
          {Array.from({ length: stepCount }, (_, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-gray-400" aria-hidden="true">
                  /
                </span>
              )}
              <span
                className={displayStep >= i ? "text-brand-accent" : ""}
                aria-current={displayStep === i ? "step" : undefined}
              >
                {i + 1}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div ref={stepRef} tabIndex={-1} className="outline-none">
      {step === 0 && (
        <div className="mx-auto max-w-xl">
          <h3 className="text-brand-dark text-lg font-bold">
            ¿Qué vehículo querés asegurar?
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
                  onClick={() => {
                    setVehicleType(v);
                    setManualVehicle(false);
                  }}
                  className={`flex cursor-pointer flex-col items-center gap-2 border px-4 py-6 text-sm font-semibold transition-colors ${
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
            className="bg-brand-accent hover:bg-brand-accent-hover mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="mx-auto max-w-xl">
          <h3 className="text-brand-dark text-lg font-bold">
            Datos del vehículo
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {manualVehicle
              ? "Un asesor va a preparar tu cotización con estos datos y te la envía."
              : vehicleType === "Auto"
                ? "Buscamos el valor de mercado real de tu auto para una cotización más precisa."
                : "Contanos las características de tu moto para una cotización precisa."}
          </p>

          {lookupError && (
            <div className="mt-4 flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {lookupError}
            </div>
          )}

          <div className="mt-5 space-y-4">
            {vehicleType === "Auto" && manualVehicle ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">
                    Cargá los datos de tu auto y un asesor te pasa la
                    cotización.
                  </p>
                  <button
                    type="button"
                    onClick={() => setManualVehicle(false)}
                    className="text-brand-accent shrink-0 cursor-pointer text-xs font-semibold hover:underline"
                  >
                    Volver a la búsqueda
                  </button>
                </div>
                <div>
                  <label
                    htmlFor="manual-brand"
                    className="mb-1.5 block text-xs font-semibold text-gray-600"
                  >
                    Marca
                  </label>
                  <input
                    id="manual-brand"
                    type="text"
                    autoComplete="off"
                    placeholder="Ej: Volkswagen"
                    value={manualBrand}
                    onChange={(e) => setManualBrand(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="manual-model"
                    className="mb-1.5 block text-xs font-semibold text-gray-600"
                  >
                    Modelo
                  </label>
                  <input
                    id="manual-model"
                    type="text"
                    autoComplete="off"
                    placeholder="Ej: Gol Trend 1.6"
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="manual-year"
                    className="mb-1.5 block text-xs font-semibold text-gray-600"
                  >
                    Año
                  </label>
                  <input
                    id="manual-year"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Ej: 2008"
                    value={manualYear}
                    onChange={(e) =>
                      setManualYear(e.target.value.replace(/\D/g, ""))
                    }
                    aria-invalid={
                      manualYear !== "" && !/^(19|20)\d{2}$/.test(manualYear)
                    }
                    className={inputClass}
                  />
                  {manualYear !== "" &&
                    !/^(19|20)\d{2}$/.test(manualYear) && (
                      <p className="mt-1 text-xs text-red-600">
                        Ingresá un año de 4 dígitos.
                      </p>
                    )}
                </div>
              </>
            ) : vehicleType === "Auto" ? (
              <>
                <div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <label
                      htmlFor="auto-brand"
                      className="block text-xs font-semibold text-gray-600"
                    >
                      Marca
                    </label>
                    {loadingBrands && (
                      <span
                        className="border-brand-accent/60 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <select
                    id="auto-brand"
                    value={autoBrandId}
                    onChange={(e) => {
                      setAutoBrandId(
                        e.target.value ? Number(e.target.value) : "",
                      );
                      setAutoYear("");
                      setAutoModelId("");
                      setAutoVersionId("");
                      setAutoModels([]);
                      setAutoVersions([]);
                      setVehicleValueARS(null);
                      setLookupError("");
                    }}
                    className={
                      loadingBrands ? `${inputClass} animate-pulse` : inputClass
                    }
                    disabled={loadingBrands || autoBrands.length === 0}
                  >
                    <option value="">
                      {loadingBrands
                        ? "Cargando marcas..."
                        : autoBrands.length === 0
                          ? "No se pudieron cargar las marcas"
                          : "Selecciona una marca"}
                    </option>
                    {autoBrands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={enterManualVehicle}
                    className="text-brand-accent mt-2 cursor-pointer text-xs font-medium hover:underline"
                  >
                    No encuentro mi auto en la lista
                  </button>
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
                      <label
                        htmlFor="auto-year"
                        className="mb-1.5 block text-xs font-semibold text-gray-600"
                      >
                        Año
                      </label>
                      <select
                        id="auto-year"
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
                      <div className="mb-1.5 flex items-center gap-2">
                        <label
                          htmlFor="auto-model"
                          className="block text-xs font-semibold text-gray-600"
                        >
                          Modelo
                        </label>
                        {loadingModels && (
                          <span
                            className="border-brand-accent/60 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <select
                        id="auto-model"
                        value={autoModelId}
                        onChange={(e) => {
                          const id = e.target.value
                            ? Number(e.target.value)
                            : "";
                          setAutoModelId(id);
                          // Años < 2012: no hay paso de versión — la "versión"
                          // es el propio modelo DNRPA (mismo id).
                          setAutoVersionId(
                            id && isLegacyYear(autoYear) ? id : "",
                          );
                          setAutoVersions([]);
                          setVehicleValueARS(null);
                          setLookupError("");
                        }}
                        className={
                          loadingModels
                            ? `${inputClass} animate-pulse`
                            : inputClass
                        }
                        disabled={loadingModels || autoModels.length === 0}
                      >
                        <option value="">
                          {loadingModels
                            ? "Cargando modelos..."
                            : autoModels.length === 0
                              ? "Sin modelos para ese año"
                              : "Selecciona"}
                        </option>
                        {autoModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      {!loadingModels && autoModels.length === 0 && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          No tenemos ese año para esta marca.{" "}
                          <button
                            type="button"
                            onClick={enterManualVehicle}
                            className="text-brand-accent cursor-pointer font-semibold hover:underline"
                          >
                            Cargá tu auto a mano
                          </button>{" "}
                          y te cotiza un asesor.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {autoModelId && !isLegacyYear(autoYear) && (
                    <motion.div
                      key="version"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <label
                          htmlFor="auto-version"
                          className="block text-xs font-semibold text-gray-600"
                        >
                          Versión
                        </label>
                        {loadingVersions && (
                          <span
                            className="border-brand-accent/60 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <select
                        id="auto-version"
                        value={autoVersionId}
                        onChange={(e) => {
                          setAutoVersionId(
                            e.target.value ? Number(e.target.value) : "",
                          );
                          setVehicleValueARS(null);
                          setLookupError("");
                        }}
                        className={
                          loadingVersions
                            ? `${inputClass} animate-pulse`
                            : inputClass
                        }
                        disabled={loadingVersions || autoVersions.length === 0}
                      >
                        <option value="">
                          {loadingVersions
                            ? "Cargando versiones..."
                            : autoVersions.length === 0
                              ? "Sin versiones para ese año"
                              : "Selecciona"}
                        </option>
                        {autoVersions.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                      {!loadingVersions && autoVersions.length > 0 && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          El año que aparece en el nombre de cada versión es el
                          de su lanzamiento, no siempre coincide con el año que
                          elegiste: es normal si tu modelo no tuvo una versión
                          nueva ese año.
                        </p>
                      )}
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
                      className="flex items-center justify-center gap-2 border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <span className="border-brand-accent/60 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                      <span className="text-xs text-gray-500">
                        {isLegacyYear(autoYear)
                          ? "Buscando el valor fiscal de referencia..."
                          : "Buscando el valor de mercado..."}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLegacyYear(autoYear) && vehicleValueARS != null && (
                  <p className="text-xs text-gray-500">
                    Para autos anteriores a 2012 usamos el{" "}
                    <span className="font-medium">
                      valor fiscal de referencia (DNRPA)
                    </span>
                    . Un asesor confirma el valor de mercado y la cobertura.
                  </p>
                )}
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="moto-brand"
                    className="mb-1.5 block text-xs font-semibold text-gray-600"
                  >
                    Marca
                  </label>
                  <select
                    id="moto-brand"
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
                        <label
                          htmlFor="moto-model"
                          className="mb-1.5 block text-xs font-semibold text-gray-600"
                        >
                          Modelo
                        </label>
                        <select
                          id="moto-model"
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
                        <label
                          htmlFor="moto-year"
                          className="mb-1.5 block text-xs font-semibold text-gray-600"
                        >
                          Año
                        </label>
                        <select
                          id="moto-year"
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
              {model &&
                (manualVehicle
                  ? /^(19|20)\d{2}$/.test(manualYear.trim())
                  : vehicleType === "Auto"
                    ? autoVersionId && autoYear
                    : motoYear) && (
                  <motion.div
                    key="cp-gnc"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="postal-code"
                        className="mb-1.5 block text-xs font-semibold text-gray-600"
                      >
                        Código Postal
                      </label>
                      <input
                        id="postal-code"
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="Ej: 3000"
                        value={postalCode}
                        onChange={(e) =>
                          setPostalCode(e.target.value.replace(/\D/g, ""))
                        }
                        aria-invalid={postalCode !== "" && !postalCodeValid}
                        className={inputClass}
                      />
                      {postalCode !== "" && !postalCodeValid && (
                        <p className="mt-1 text-xs text-red-600">
                          El código postal tiene 4 dígitos.
                        </p>
                      )}
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
            className="bg-brand-accent hover:bg-brand-accent-hover mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
            providerInput={
              vehicleType === "Auto" && vehicleValueARS
                ? {
                    vehicleType: "Auto",
                    brand,
                    model,
                    version: selectedAutoVersionName || undefined,
                    year: Number(year),
                    vehicleValueARS,
                    hasGnc,
                    postalCode,
                    // También en años legacy: el id es el del modelo DNRPA, pero
                    // sirve igual como clave de cache del vehicle-xref, que
                    // matchea por marca/modelo/versión contra el catálogo de la
                    // aseguradora (que sí tiene modelos viejos).
                    catalogVersionId:
                      typeof autoVersionId === "number"
                        ? autoVersionId
                        : undefined,
                  }
                : undefined
            }
          />
          <button
            onClick={handleNext}
            disabled={!selectedTier}
            className="bg-brand-accent hover:bg-brand-accent-hover mx-auto mt-6 flex w-full max-w-xl cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="mx-auto max-w-xl">
          <h3 className="text-brand-dark text-lg font-bold">Tus datos</h3>
          <p className="mt-1 text-sm text-gray-600">
            {manualVehicle
              ? "Dejanos tus datos y un asesor te arma la cotización de tu auto."
              : "Dejanos tu información para enviarte la cotización."}
          </p>
          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-xs font-semibold text-gray-600"
              >
                Nombre y apellido
              </label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                placeholder="Nombre y apellido"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="contact-phone"
                className="mb-1.5 block text-xs font-semibold text-gray-600"
              >
                Teléfono / WhatsApp
              </label>
              <input
                id="contact-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Ej: 342 512 3456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={phone !== "" && !phoneValid}
                className={inputClass}
              />
              {phone !== "" && !phoneValid && (
                <p className="mt-1 text-xs text-red-600">
                  Ingresá un teléfono válido con característica.
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-xs font-semibold text-gray-600"
              >
                Email (opcional)
              </label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!emailValid}
                className={inputClass}
              />
              {!emailValid && (
                <p className="mt-1 text-xs text-red-600">
                  Revisá el formato del email.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleNext}
            disabled={!contactComplete}
            className="bg-brand-accent hover:bg-brand-accent-hover mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cotizar ahora
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="mx-auto max-w-xl text-center">
          <div className="bg-brand-accent-soft mx-auto flex h-14 w-14 items-center justify-center rounded-full">
            <Check className="text-brand-accent h-6 w-6" />
          </div>
          <h3 className="text-brand-dark mt-4 text-lg font-bold">
            ¡Listo, {name}!
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {manualVehicle ? (
              <>
                Un asesor va a preparar la cotización de tu{" "}
                <span className="text-brand-dark font-semibold">
                  {vehicleType.toLowerCase()}
                </span>{" "}
                y te la envía por WhatsApp.
              </>
            ) : (
              <>
                Vamos a enviarte la cotización de tu seguro de{" "}
                <span className="text-brand-dark font-semibold">
                  {vehicleType.toLowerCase()}
                </span>{" "}
                por WhatsApp.
              </>
            )}
          </p>
          <div className="mt-4 border border-gray-200 bg-gray-50 p-3 text-left text-xs text-gray-600">
            <p>
              {brand} {model} - {year}
            </p>
            {hasGnc && <p>Con GNC</p>}
            <p>CP: {postalCode}</p>
            {selectedTierPrice && (
              <p className="text-brand-dark mt-1 font-semibold">
                {selectedTierPrice.label}:{" "}
                {formatPriceARS(selectedTierPrice.monthlyPrice)}/mes aprox.
              </p>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleWhatsApp}
              disabled={submitting}
              className="bg-whatsapp inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              Enviar por WhatsApp
            </button>
            <button
              onClick={reset}
              className="inline-flex cursor-pointer items-center justify-center gap-2 border border-gray-200 px-8 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300"
            >
              Cotizar otro seguro
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
