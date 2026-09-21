// Modelo de la propuesta que se arma en /admin/propuestas. Es un formulario
// plano (sin editor de texto libre): cada campo es un texto con formato simple
// (negrita / cursiva / subrayado) y las secciones repetibles son listas.

export type Format = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export type Styled = Format & { text: string };

// Linea de una lista; `bullet` antepone "• " (dificil de tipear en el teclado).
export type Line = Styled & { bullet: boolean };

export type Cobertura = { item: Styled; suma: string };

export type PlanRow = {
  recibo: string;
  importe: string;
  cuota: string;
  vencimiento: string;
};

export type Proposal = {
  rama: Styled;
  propuesta: Styled;
  desde: Styled;
  hasta: Styled;
  asegurado: Styled;
  domicilio: Styled;
  dni: Styled;
  ubicacion: Line[];
  clientesAdicionales: Line[];
  coberturas: Cobertura[];
  anexos: Line[];
  objeto: Styled;
  plan: PlanRow[];
  lugarFecha: Styled;
};

export const styled = (text = "", format: Partial<Format> = {}): Styled => ({
  text,
  bold: false,
  italic: false,
  underline: false,
  ...format,
});

export const newLine = (): Line => ({ ...styled(), bullet: false });
export const newCobertura = (): Cobertura => ({ item: styled(), suma: "" });
export const newPlanRow = (): PlanRow => ({
  recibo: "",
  importe: "",
  cuota: "",
  vencimiento: "",
});

export const emptyProposal = (): Proposal => ({
  rama: styled("", { bold: true }),
  propuesta: styled("", { bold: true }),
  desde: styled(),
  hasta: styled(),
  asegurado: styled("", { bold: true }),
  domicilio: styled(),
  dni: styled(),
  ubicacion: [newLine()],
  clientesAdicionales: [newLine()],
  coberturas: [newCobertura()],
  anexos: [newLine()],
  objeto: styled(),
  plan: [newPlanRow()],
  lugarFecha: styled(),
});

// Hoja carta a 96 dpi: el PDF original de Sancor es Letter (612x792 pt), no A4.
export const SHEET_WIDTH = 816;
export const SHEET_HEIGHT = 1056;
