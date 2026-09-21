import type { CSSProperties, ReactNode } from "react";
import {
  SHEET_HEIGHT,
  SHEET_WIDTH,
  type Format,
  type Line,
  type Proposal,
  type Styled,
} from "@/lib/proposal";

// Hoja carta que imita la primera pagina de la poliza RC de Sancor. Las medidas
// (px a 96 dpi) salen del PDF original; las secciones tienen un alto minimo para
// que en blanco queden donde estan en el formulario y crezcan si hay mas contenido.

const formatStyle = (f: Format): CSSProperties => ({
  fontWeight: f.bold ? 700 : undefined,
  fontStyle: f.italic ? "italic" : undefined,
  textDecoration: f.underline ? "underline" : undefined,
});

function Text({ value }: { value: Styled }) {
  return (
    <span style={{ ...formatStyle(value), whiteSpace: "pre-wrap" }}>
      {value.text}
    </span>
  );
}

function Lines({ lines, className }: { lines: Line[]; className: string }) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div
          key={i}
          className="min-h-[1.3em]"
          style={{ ...formatStyle(line), whiteSpace: "pre-wrap" }}
        >
          {line.bullet && "• "}
          {line.text}
        </div>
      ))}
    </div>
  );
}

function Heading({
  children,
  rule = true,
}: {
  children: ReactNode;
  rule?: boolean;
}) {
  return (
    <div
      className={`w-[271px] pb-[2px] text-[7.5px] leading-[9px] font-bold tracking-[0.22em] uppercase italic ${
        rule ? "border-b-[1.5px] border-black" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function ProposalSheet({ doc }: { doc: Proposal }) {
  return (
    <div
      className="relative bg-white text-black [-webkit-print-color-adjust:exact] [print-color-adjust:exact]"
      style={{
        width: SHEET_WIDTH,
        minHeight: SHEET_HEIGHT,
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Encabezado */}
      <div className="absolute top-[16px] left-[111px] max-w-[510px] text-[26px] leading-[1.15]">
        <Text value={doc.rama} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/admin/assets/sancor-logo.png"
        alt="Sancor Seguros"
        className="absolute top-[25px] left-[643px] w-[144px]"
      />

      <div className="absolute top-[92px] left-[111px] max-w-[360px] text-[15px] leading-[17px]">
        Número de propuesta: <Text value={doc.propuesta} />
      </div>
      <div className="absolute top-[113px] left-[111px] text-[14px] font-bold italic">
        Emisión
      </div>

      <div className="absolute top-[130px] left-[108px] h-[39px] w-[252px] border-2 border-black">
        <div className="h-[13px] border-b-2 border-black bg-[#d9d9d9] text-center text-[10px] leading-[11px] font-bold">
          VIGENCIA
        </div>
        <div className="flex h-[20px]">
          <div className="flex w-1/2 items-center border-r-2 border-black px-[7px] text-[8px] leading-[9px]">
            <span>
              Desde <Text value={doc.desde} />
            </span>
          </div>
          <div className="flex w-1/2 items-center px-[7px] text-[8px] leading-[9px]">
            <span>
              Hasta <Text value={doc.hasta} />
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-[93px] left-[483px] w-[305px] text-[11.5px] leading-[15px]">
        <div>
          Asegurado:{" "}
          <span className="text-[13.5px]">
            <Text value={doc.asegurado} />
          </span>
        </div>
        <div>
          Domicilio: <Text value={doc.domicilio} />
        </div>
        <div>
          DNI: <Text value={doc.dni} />
        </div>
      </div>

      <div className="absolute top-[199px] left-[110px] h-[2px] w-[678px] bg-black" />

      {/* Caja lateral con el telefono de atencion (texto vertical, de abajo hacia arriba) */}
      <div className="absolute top-[268px] left-[30px] h-[533px] w-[50px] border-[1.5px] border-black">
        <div className="absolute bottom-[22px] left-1/2 -translate-x-1/2 rotate-180 text-[21.5px] leading-none font-bold whitespace-nowrap [writing-mode:vertical-rl]">
          0800 444 28500
        </div>
        <div className="absolute top-[51px] left-1/2 -translate-x-1/2 rotate-180 text-[14.8px] leading-none whitespace-nowrap [writing-mode:vertical-rl]">
          CENTRO DE ATENCIÓN AL CLIENTE
        </div>
      </div>

      {/* Cuerpo */}
      <div className="relative pt-[227px] pr-[28px] pb-[40px] pl-[110px]">
        <section className="min-h-[44px]">
          <Heading rule={false}>Ubicación del riesgo</Heading>
          <Lines
            lines={doc.ubicacion}
            className="mt-[2px] pl-[7px] text-[10.75px] leading-[14.5px]"
          />
        </section>

        <section className="min-h-[74px]">
          <Heading>Clientes adicionales</Heading>
          <Lines
            lines={doc.clientesAdicionales}
            className="mt-[5px] pl-[12px] text-[9.5px] leading-[12px]"
          />
        </section>

        <section className="min-h-[77px]">
          <Heading>Coberturas</Heading>
          <div className="mt-[1px] mr-[13px] flex justify-between border-b-[1.5px] border-[#777] px-[12px] pb-[1px] text-[10px] leading-[12px]">
            <span>Cobertura</span>
            <span>Suma asegurada</span>
          </div>
          <div className="mr-[13px] pt-[3px]">
            {doc.coberturas.map((cobertura, i) => (
              <div
                key={i}
                className="flex min-h-[12px] justify-between gap-4 pr-[5px] pl-[12px] text-[9px] leading-[12px]"
              >
                <span>
                  {cobertura.item.text && "• "}
                  <Text value={cobertura.item} />
                </span>
                <span className="text-[10px] font-bold whitespace-nowrap">
                  {cobertura.suma}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-[127px]">
          <Heading>Anexos y cláusulas</Heading>
          <Lines
            lines={doc.anexos}
            className="pl-[12px] text-[10px] leading-[13px]"
          />
        </section>

        <section className="min-h-[139px] pl-[12px] text-[10.5px] leading-[13.5px]">
          OBJETO DEL SEGURO: <Text value={doc.objeto} />
        </section>

        <section className="min-h-[119px]">
          <Heading>Plan de pago</Heading>
          <table className="mt-[2px] w-[332px] table-fixed border-collapse text-[9.2px] leading-[12px]">
            <colgroup>
              <col style={{ width: 104 }} />
              <col style={{ width: 70 }} />
              <col style={{ width: 60 }} />
              <col style={{ width: 98 }} />
            </colgroup>
            <thead>
              <tr className="border-b-[1.5px] border-[#777] text-[8px] font-bold">
                <th className="pl-[16px] text-left font-bold">Recibo</th>
                <th className="text-right font-bold">Importe</th>
                <th className="text-right font-bold">Cuota</th>
                <th className="pl-[14px] text-left font-bold">Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {doc.plan.map((row, i) => (
                <tr key={i} className="h-[12px]">
                  <td className="pl-[16px]">{row.recibo}</td>
                  <td className="text-right">{row.importe}</td>
                  <td className="text-right">{row.cuota}</td>
                  <td className="pl-[14px]">{row.vencimiento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Pie */}
        <div className="border-b-[1.5px] border-black pb-[3px] text-[9.3px] leading-[12px] font-bold">
          Esta cobertura es abonada mediante débito por C.B.U. - Débito directo
          en cuenta
        </div>
        <div className="mt-[11px] flex items-start justify-between">
          <div className="text-[11px]">
            Santa Fe: <Text value={doc.lugarFecha} />
          </div>
          <div className="mt-[29px] w-[92px] text-center text-[7.8px] leading-[9px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/admin/assets/firma-gerente-general.png"
              alt=""
              className="mx-auto mb-[10px] w-[87px]"
            />
            ALEJANDRO SIMON
            <br />
            GERENTE GENERAL
          </div>
        </div>
      </div>
    </div>
  );
}
