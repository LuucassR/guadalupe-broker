import { test, expect } from "@playwright/test";
import {
  calculateAutoMotoQuote,
  formatPriceARS,
  RC_BASE_MONTHLY_AUTO,
  TC_ANNUAL_PCT_OF_VALUE,
  TR_ANNUAL_PCT_OF_VALUE,
  FRANQUICIA_DISCOUNT,
  GNC_SURCHARGE_PCT,
  getZoneMultiplier,
} from "@/lib/pricing";

// Precios de la columna "clasica" del multicotizador: son la formula propia de
// lib/pricing.ts. Estos tests fijan valores de referencia para un par de casos
// canonicos y verifican las relaciones que siempre deben cumplirse.

const round500 = (n: number) => Math.round(n / 500) * 500;

test.describe("formula de precios (columna clasica)", () => {
  test("Auto - caso canonico (valor 20M, CP 3000, sin GNC)", () => {
    const { tiers } = calculateAutoMotoQuote(
      {
        vehicleType: "Auto",
        brand: "Toyota",
        model: "Corolla",
        year: "2022",
        hasGnc: false,
        postalCode: "3000",
        vehicleValueARS: 20_000_000,
      },
      0,
    );
    const by = Object.fromEntries(tiers.map((t) => [t.tier, t.monthlyPrice]));

    expect(by["rc"]).toBe(round500(RC_BASE_MONTHLY_AUTO * 1)); // 32.000
    expect(by["terceros-completo"]).toBe(
      round500((20_000_000 * TC_ANNUAL_PCT_OF_VALUE) / 12), // 41.500
    );
    expect(by["todo-riesgo"]).toBe(
      round500((20_000_000 * TR_ANNUAL_PCT_OF_VALUE) / 12), // 100.000
    );

    // Orden monotono y etiquetas/beneficios presentes.
    expect(by["rc"]).toBeLessThan(by["terceros-completo"]);
    expect(by["terceros-completo"]).toBeLessThan(by["todo-riesgo"]);
    for (const t of tiers) {
      expect(t.monthlyPrice).toBeGreaterThan(0);
      expect(t.benefits.length).toBeGreaterThan(0);
    }
  });

  test("Auto - la zona (CP) multiplica RC", () => {
    const caba = calculateAutoMotoQuote(
      {
        vehicleType: "Auto",
        brand: "VW",
        model: "Gol",
        year: "2021",
        hasGnc: false,
        postalCode: "1425",
        vehicleValueARS: 20_000_000,
      },
      0,
    );
    const rcCaba = caba.tiers.find((t) => t.tier === "rc")!.monthlyPrice;
    expect(getZoneMultiplier("1425")).toBeGreaterThan(1);
    expect(rcCaba).toBe(
      round500(RC_BASE_MONTHLY_AUTO * getZoneMultiplier("1425")),
    );
    expect(rcCaba).toBeGreaterThan(RC_BASE_MONTHLY_AUTO); // > que CP 3000
  });

  test("Auto - franquicia 20% abarata Todo Riesgo", () => {
    const base = calculateAutoMotoQuote(
      {
        vehicleType: "Auto",
        brand: "x",
        model: "y",
        year: "2022",
        hasGnc: false,
        postalCode: "3000",
        vehicleValueARS: 20_000_000,
      },
      0,
    );
    const conFranq = calculateAutoMotoQuote(
      {
        vehicleType: "Auto",
        brand: "x",
        model: "y",
        year: "2022",
        hasGnc: false,
        postalCode: "3000",
        vehicleValueARS: 20_000_000,
      },
      20,
    );
    const tr0 = base.tiers.find((t) => t.tier === "todo-riesgo")!.monthlyPrice;
    const tr20 = conFranq.tiers.find(
      (t) => t.tier === "todo-riesgo",
    )!.monthlyPrice;

    expect(tr20).toBeLessThan(tr0);
    expect(tr20).toBe(round500(tr0 * (1 - FRANQUICIA_DISCOUNT[20])));
    // RC no cambia con la franquicia.
    expect(conFranq.tiers.find((t) => t.tier === "rc")!.monthlyPrice).toBe(
      base.tiers.find((t) => t.tier === "rc")!.monthlyPrice,
    );
  });

  test("Auto - GNC recarga Terceros Completo y Todo Riesgo, no RC", () => {
    const sin = calculateAutoMotoQuote(
      {
        vehicleType: "Auto",
        brand: "x",
        model: "y",
        year: "2022",
        hasGnc: false,
        postalCode: "3000",
        vehicleValueARS: 20_000_000,
      },
      0,
    );
    const con = calculateAutoMotoQuote(
      {
        vehicleType: "Auto",
        brand: "x",
        model: "y",
        year: "2022",
        hasGnc: true,
        postalCode: "3000",
        vehicleValueARS: 20_000_000,
      },
      0,
    );
    expect(con.tiers.find((t) => t.tier === "rc")!.monthlyPrice).toBe(
      sin.tiers.find((t) => t.tier === "rc")!.monthlyPrice,
    );
    expect(
      con.tiers.find((t) => t.tier === "terceros-completo")!.monthlyPrice,
    ).toBe(
      round500(
        ((20_000_000 * TC_ANNUAL_PCT_OF_VALUE) / 12) * (1 + GNC_SURCHARGE_PCT),
      ),
    );
  });

  test("Moto - 3 coberturas con precio y orden monotono", () => {
    const { tiers } = calculateAutoMotoQuote(
      {
        vehicleType: "Moto",
        brand: "Honda",
        model: "CB125F Twister",
        year: "2022",
        hasGnc: false,
        postalCode: "3000",
      },
      0,
    );
    expect(tiers.map((t) => t.tier)).toEqual([
      "rc",
      "terceros-completo",
      "todo-riesgo",
    ]);
    expect(tiers[0].monthlyPrice).toBeLessThan(tiers[1].monthlyPrice);
    expect(tiers[1].monthlyPrice).toBeLessThan(tiers[2].monthlyPrice);
    expect(tiers.every((t) => t.monthlyPrice > 0)).toBe(true);
  });

  test("formatPriceARS devuelve pesos sin decimales", () => {
    const s = formatPriceARS(41500);
    expect(s).toMatch(/\$\s?41\.500/);
    expect(s).not.toMatch(/,\d\d$/);
  });
});
