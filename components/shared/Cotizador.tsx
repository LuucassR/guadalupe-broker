"use client"

import { useState } from "react"
import { COVERAGES, SITE_CONFIG } from "@/constants/site"
import { Check, Send, ArrowLeft } from "lucide-react"

const CAR_BRANDS = [
  "Alfa Romeo", "Audi", "BMW", "Chevrolet", "Chrysler", "Citroen", "Dodge",
  "Fiat", "Ford", "Honda", "Hyundai", "Iveco", "Jaguar", "Jeep", "Kia",
  "Land Rover", "Mercedes-Benz", "Mitsubishi", "Nissan", "Peugeot", "RAM",
  "Renault", "Subaru", "Suzuki", "Toyota", "Volkswagen", "Volvo",
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => String(CURRENT_YEAR - i))

export default function Cotizador() {
  const [step, setStep] = useState(0)
  const [coverage, setCoverage] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [hasGnc, setHasGnc] = useState(false)
  const [postalCode, setPostalCode] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const isAutomotor = coverage === "Automotor"

  const handleNext = () => {
    if (step === 0 && coverage) {
      if (isAutomotor) setStep(1)
      else setStep(2)
    } else if (step === 1 && brand && model && year && postalCode) {
      setStep(2)
    } else if (step === 2 && name && phone) {
      setStep(3)
    }
  }

  const buildMessage = () => {
    let text = `Hola, quiero cotizar ${coverage}.`
    if (isAutomotor) {
      text += ` Marca: ${brand}, Modelo: ${model}, Año: ${year}`
      if (hasGnc) text += ", Tiene GNC"
      text += "."
    }
    text += ` CP: ${postalCode}. Nombre: ${name}, Email: ${email || "-"}, Tel: ${phone}`
    return text
  }

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=${encodeURIComponent(buildMessage())}`,
      "_blank",
    )
  }

  const reset = () => {
    setStep(0)
    setCoverage("")
    setBrand("")
    setModel("")
    setYear("")
    setHasGnc(false)
    setPostalCode("")
    setName("")
    setEmail("")
    setPhone("")
  }

  const totalSteps = isAutomotor ? 4 : 3

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-brand-rose hover:text-brand-rose"
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
          {Array.from({ length: totalSteps }, (_, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-gray-300">/</span>}
              <span className={step >= i ? "text-brand-rose" : ""}>{i + 1}</span>
            </span>
          ))}
        </div>
      </div>

      {step === 0 && (
        <div>
          <h3 className="text-lg font-bold text-brand-dark">
            Que cobertura necesitas?
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Selecciona el tipo de seguro que queres cotizar.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {COVERAGES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCoverage(c.name)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                  coverage === c.name
                    ? "border-brand-rose bg-brand-rose/5 text-brand-rose"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {c.name}
                {coverage === c.name && (
                  <Check className="h-4 w-4 shrink-0 ml-auto" />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!coverage}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {isAutomotor && step === 1 && (
        <div>
          <h3 className="text-lg font-bold text-brand-dark">
            Datos del vehiculo
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Contanos las caracteristicas de tu auto para una cotizacion precisa.
          </p>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                Marca
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-brand-rose/50 focus:ring-2 focus:ring-brand-rose/10"
              >
                <option value="">Selecciona una marca</option>
                {CAR_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                Modelo
              </label>
              <input
                type="text"
                placeholder="Ej: Cronos, Corolla, Amarok"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-rose/50 focus:ring-2 focus:ring-brand-rose/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                  Año
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-brand-rose/50 focus:ring-2 focus:ring-brand-rose/10"
                >
                  <option value="">Selecciona</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                  Codigo Postal
                </label>
                <input
                  type="text"
                  placeholder="Ej: 3000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-rose/50 focus:ring-2 focus:ring-brand-rose/10"
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50">
              <input
                type="checkbox"
                checked={hasGnc}
                onChange={(e) => setHasGnc(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-rose accent-brand-rose"
              />
              <span className="text-sm font-medium text-gray-700">
                Tiene equipo GNC
              </span>
            </label>
          </div>
          <button
            onClick={handleNext}
            disabled={!brand || !model || !year || !postalCode}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {!isAutomotor && step === 1 && (
        <div>
          <h3 className="text-lg font-bold text-brand-dark">
            Tu ubicacion
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Decinos tu codigo postal para una cotizacion ajustada.
          </p>
          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Codigo Postal
            </label>
            <input
              type="text"
              placeholder="Ej: 3000"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-rose/50 focus:ring-2 focus:ring-brand-rose/10"
            />
          </div>
          <button
            onClick={handleNext}
            disabled={!postalCode}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {(isAutomotor ? step === 2 : step === 1) && (
        <div>
          <h3 className="text-lg font-bold text-brand-dark">
            Tus datos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Dejanos tu informacion para enviarte la cotizacion.
          </p>
          <div className="mt-5 space-y-4">
            <input
              type="text"
              placeholder="Nombre y apellido"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-rose/50 focus:ring-2 focus:ring-brand-rose/10"
            />
            <input
              type="email"
              placeholder="Email (opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-rose/50 focus:ring-2 focus:ring-brand-rose/10"
            />
            <input
              type="tel"
              placeholder="Telefono / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-rose/50 focus:ring-2 focus:ring-brand-rose/10"
            />
          </div>
          <button
            onClick={handleNext}
            disabled={!name || !phone}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-40"
          >
            Cotizar ahora
          </button>
        </div>
      )}

      {(isAutomotor ? step === 3 : step === 2) && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-rose/10">
            <Check className="h-6 w-6 text-brand-rose" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-brand-dark">
            Listo, {name}!
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Vamos a enviarte la cotizacion de{" "}
            <span className="font-semibold text-brand-dark">{coverage}</span>{" "}
            por WhatsApp.
          </p>
          {isAutomotor && (
            <div className="mt-4 rounded-xl bg-gray-50 p-3 text-left text-xs text-gray-500">
              <p>{brand} {model} - {year}</p>
              {hasGnc && <p>Con GNC</p>}
              <p>CP: {postalCode}</p>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-8 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              <Send className="h-4 w-4" />
              Enviar por WhatsApp
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-8 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300"
            >
              Cotizar otro seguro
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
