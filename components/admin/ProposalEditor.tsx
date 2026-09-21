"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bold, Italic, Plus, Printer, Underline, X } from "lucide-react";
import ProposalSheet from "./ProposalSheet";
import {
  SHEET_HEIGHT,
  SHEET_WIDTH,
  emptyProposal,
  newCobertura,
  newLine,
  newPlanRow,
  type Format,
  type Line,
  type Proposal,
  type Styled,
} from "@/lib/proposal";

// El PDF se genera con "Imprimir > Guardar como PDF" del navegador: la hoja se
// imprime tal cual se ve, a tamaño carta y sin el zoom del preview.
const PRINT_CSS = `
@page { size: letter; margin: 0; }
@media print {
  body { background: #fff; }
  .sheet-zoom { zoom: 1 !important; }
}`;

const INPUT_CLASS =
  "border-border focus:border-brand-accent w-full min-w-0 border bg-white px-2 py-1.5 text-sm outline-none";

type ToggleKey = keyof Format | "bullet";

function ToggleButton({
  label,
  on,
  onClick,
  children,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      className={`flex h-[34px] w-7 shrink-0 cursor-pointer items-center justify-center border text-sm transition-colors ${
        on
          ? "bg-brand-dark border-brand-dark text-white"
          : "border-border text-text-secondary hover:bg-bg-muted bg-white"
      }`}
    >
      {children}
    </button>
  );
}

// Texto con formato: input (o textarea) + botones de negrita / cursiva /
// subrayado y, en las listas, viñeta.
function StyledInput<T extends Styled>({
  label,
  hideLabel,
  value,
  onChange,
  placeholder,
  multiline,
  bullet,
}: {
  label: string;
  hideLabel?: boolean;
  value: T;
  onChange: (next: T) => void;
  placeholder?: string;
  multiline?: boolean;
  bullet?: boolean;
}) {
  const flags = value as Styled & { bullet?: boolean };
  const toggle = (key: ToggleKey) => onChange({ ...value, [key]: !flags[key] });
  const setText = (text: string) => onChange({ ...value, text });

  return (
    <div>
      <div
        className={
          hideLabel
            ? "sr-only"
            : "text-text-secondary mb-1 text-xs font-semibold"
        }
      >
        {label}
      </div>
      <div className="flex items-start gap-0.5">
        {multiline ? (
          <textarea
            aria-label={label}
            rows={4}
            value={value.text}
            placeholder={placeholder}
            onChange={(e) => setText(e.target.value)}
            className={`${INPUT_CLASS} mr-1 resize-y`}
          />
        ) : (
          <input
            aria-label={label}
            value={value.text}
            placeholder={placeholder}
            onChange={(e) => setText(e.target.value)}
            className={`${INPUT_CLASS} mr-1`}
          />
        )}
        <ToggleButton
          label="Negrita"
          on={value.bold}
          onClick={() => toggle("bold")}
        >
          <Bold size={14} />
        </ToggleButton>
        <ToggleButton
          label="Cursiva"
          on={value.italic}
          onClick={() => toggle("italic")}
        >
          <Italic size={14} />
        </ToggleButton>
        <ToggleButton
          label="Subrayado"
          on={value.underline}
          onClick={() => toggle("underline")}
        >
          <Underline size={14} />
        </ToggleButton>
        {bullet && (
          <ToggleButton
            label="Viñeta"
            on={!!flags.bullet}
            onClick={() => toggle("bullet")}
          >
            •
          </ToggleButton>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-border space-y-3 border bg-white p-3">
      <h2 className="font-heading text-brand-dark text-sm font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

function RemoveButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="text-text-muted flex h-[34px] w-7 shrink-0 cursor-pointer items-center justify-center transition-colors hover:text-red-600"
    >
      <X size={14} />
    </button>
  );
}

function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-brand-accent hover:text-brand-accent-hover flex cursor-pointer items-center gap-1 text-xs font-semibold"
    >
      <Plus size={14} /> {children}
    </button>
  );
}

function replaceAt<T>(list: T[], index: number, next: T): T[] {
  return list.map((item, i) => (i === index ? next : item));
}

function LinesSection({
  title,
  lines,
  onChange,
}: {
  title: string;
  lines: Line[];
  onChange: (lines: Line[]) => void;
}) {
  return (
    <Section title={title}>
      {lines.map((line, i) => (
        <div key={i} className="flex items-start gap-0.5">
          <div className="min-w-0 flex-1">
            <StyledInput
              label={`${title}, línea ${i + 1}`}
              hideLabel
              bullet
              value={line}
              onChange={(next) => onChange(replaceAt(lines, i, next))}
            />
          </div>
          <RemoveButton
            label={`Quitar línea ${i + 1} de ${title}`}
            onClick={() => onChange(lines.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <AddButton onClick={() => onChange([...lines, newLine()])}>
        Agregar línea
      </AddButton>
    </Section>
  );
}

export default function ProposalEditor() {
  const [doc, setDoc] = useState<Proposal>(emptyProposal);
  const [scale, setScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof Proposal>(key: K, value: Proposal[K]) =>
    setDoc((d) => ({ ...d, [key]: value }));

  // El preview se achica (zoom) para entrar en su columna; al imprimir vuelve a 1.
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(Math.min(1, entry.contentRect.width / SHEET_WIDTH)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // El navegador propone el titulo de la pagina como nombre del PDF.
  useEffect(() => {
    document.title = doc.propuesta.text
      ? `Propuesta ${doc.propuesta.text}`
      : "Propuesta";
  }, [doc.propuesta.text]);

  return (
    <div className="flex flex-col gap-6 p-4 lg:flex-row lg:items-start lg:p-6 print:block print:p-0">
      <style>{PRINT_CSS}</style>

      <div className="w-full space-y-3 lg:w-[360px] lg:shrink-0 print:hidden">
        <Section title="Encabezado">
          <StyledInput
            label="Rama"
            placeholder="Responsabilidad Civil"
            value={doc.rama}
            onChange={(v) => update("rama", v)}
          />
          <StyledInput
            label="Número de propuesta"
            value={doc.propuesta}
            onChange={(v) => update("propuesta", v)}
          />
          <StyledInput
            label="Vigencia desde"
            placeholder="las 12 hs 18/4/2023"
            value={doc.desde}
            onChange={(v) => update("desde", v)}
          />
          <StyledInput
            label="Vigencia hasta"
            placeholder="las 12 hs 18/4/2024"
            value={doc.hasta}
            onChange={(v) => update("hasta", v)}
          />
        </Section>

        <Section title="Asegurado">
          <StyledInput
            label="Nombre y apellido"
            value={doc.asegurado}
            onChange={(v) => update("asegurado", v)}
          />
          <StyledInput
            label="Domicilio"
            value={doc.domicilio}
            onChange={(v) => update("domicilio", v)}
          />
          <StyledInput
            label="DNI"
            value={doc.dni}
            onChange={(v) => update("dni", v)}
          />
        </Section>

        <LinesSection
          title="Ubicación del riesgo"
          lines={doc.ubicacion}
          onChange={(v) => update("ubicacion", v)}
        />

        <LinesSection
          title="Clientes adicionales"
          lines={doc.clientesAdicionales}
          onChange={(v) => update("clientesAdicionales", v)}
        />

        <Section title="Coberturas">
          {doc.coberturas.map((cobertura, i) => (
            <div key={i} className="flex items-start gap-0.5">
              <div className="min-w-0 flex-1 space-y-1">
                <StyledInput
                  label={`Cobertura ${i + 1}`}
                  value={cobertura.item}
                  onChange={(item) =>
                    update(
                      "coberturas",
                      replaceAt(doc.coberturas, i, { ...cobertura, item }),
                    )
                  }
                />
                <input
                  aria-label={`Suma asegurada ${i + 1}`}
                  placeholder="Suma asegurada  ($ 500.000,00)"
                  value={cobertura.suma}
                  onChange={(e) =>
                    update(
                      "coberturas",
                      replaceAt(doc.coberturas, i, {
                        ...cobertura,
                        suma: e.target.value,
                      }),
                    )
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <RemoveButton
                label={`Quitar cobertura ${i + 1}`}
                onClick={() =>
                  update(
                    "coberturas",
                    doc.coberturas.filter((_, j) => j !== i),
                  )
                }
              />
            </div>
          ))}
          <AddButton
            onClick={() =>
              update("coberturas", [...doc.coberturas, newCobertura()])
            }
          >
            Agregar cobertura
          </AddButton>
        </Section>

        <LinesSection
          title="Anexos y cláusulas"
          lines={doc.anexos}
          onChange={(v) => update("anexos", v)}
        />

        <Section title="Objeto del seguro">
          <StyledInput
            label="Objeto del seguro"
            hideLabel
            multiline
            value={doc.objeto}
            onChange={(v) => update("objeto", v)}
          />
        </Section>

        <Section title="Plan de pago">
          <div className="text-text-secondary grid grid-cols-4 gap-1 pr-8 text-xs font-semibold">
            <span>Recibo</span>
            <span>Importe</span>
            <span>Cuota</span>
            <span>Vencimiento</span>
          </div>
          {doc.plan.map((row, i) => (
            <div key={i} className="flex items-start gap-0.5">
              <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
                {(
                  [
                    ["recibo", "Recibo"],
                    ["importe", "Importe"],
                    ["cuota", "Cuota"],
                    ["vencimiento", "Vencimiento"],
                  ] as const
                ).map(([key, label]) => (
                  <input
                    key={key}
                    aria-label={`${label} ${i + 1}`}
                    value={row[key]}
                    onChange={(e) =>
                      update(
                        "plan",
                        replaceAt(doc.plan, i, {
                          ...row,
                          [key]: e.target.value,
                        }),
                      )
                    }
                    className={INPUT_CLASS}
                  />
                ))}
              </div>
              <RemoveButton
                label={`Quitar cuota ${i + 1}`}
                onClick={() =>
                  update(
                    "plan",
                    doc.plan.filter((_, j) => j !== i),
                  )
                }
              />
            </div>
          ))}
          <AddButton
            onClick={() => update("plan", [...doc.plan, newPlanRow()])}
          >
            Agregar cuota
          </AddButton>
        </Section>

        <Section title="Pie">
          <StyledInput
            label="Santa Fe (fecha)"
            placeholder="20 de septiembre de 2026"
            value={doc.lugarFecha}
            onChange={(v) => update("lugarFecha", v)}
          />
        </Section>
      </div>

      <div
        ref={previewRef}
        className="min-w-0 flex-1 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto print:static print:max-h-none print:overflow-visible"
      >
        <div
          className="mx-auto mb-3 flex justify-end print:hidden"
          style={{ maxWidth: SHEET_WIDTH }}
        >
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-brand-dark hover:bg-brand-accent flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            <Printer size={16} /> Imprimir / Guardar PDF
          </button>
        </div>
        <div
          data-testid="proposal-preview"
          className="sheet-zoom relative mx-auto shadow-lg print:shadow-none"
          style={{ zoom: scale, width: SHEET_WIDTH }}
        >
          <ProposalSheet doc={doc} />
          {/* Marca del fin de la hoja carta: lo que pase de aca sale en una 2da pagina. */}
          <div
            aria-hidden
            className="absolute left-0 w-full border-t border-dashed border-red-400 print:hidden"
            style={{ top: SHEET_HEIGHT }}
          />
        </div>
      </div>
    </div>
  );
}
