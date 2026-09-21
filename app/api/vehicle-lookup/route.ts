import { NextResponse } from "next/server";
import { logConsult } from "@/lib/consult-log";
import {
  fetchVehicleBrands,
  fetchVehicleModels,
  fetchVehicleVersions,
  fetchVehicleValueARS,
} from "@/lib/vehicle-valuation";
import { guardRequest } from "@/lib/security";

function intParam(searchParams: URLSearchParams, key: string, max: number) {
  const value = Number(searchParams.get(key));
  return Number.isInteger(value) && value > 0 && value <= max ? value : null;
}

export async function GET(request: Request) {
  const rejected = guardRequest(request, {
    name: "vehicle-lookup",
    limit: 60,
    windowMs: 60_000,
  });
  if (rejected) return rejected;

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "brands") {
      const data = await fetchVehicleBrands();
      logConsult(request, { step: "brands", vehicleType: "Auto" });
      return NextResponse.json({ data });
    }

    if (action === "models") {
      const brandId = intParam(searchParams, "brandId", Number.MAX_SAFE_INTEGER);
      const year = intParam(searchParams, "year", 2100);
      if (!brandId) return NextResponse.json({ error: "brandId invalido" }, { status: 400 });
      if (!year) return NextResponse.json({ error: "year invalido" }, { status: 400 });
      const data = await fetchVehicleModels(brandId, year);
      const brand = (await fetchVehicleBrands()).find((b) => b.id === brandId);
      logConsult(request, { step: "models", vehicleType: "Auto", brand: brand?.name, year });
      return NextResponse.json({ data });
    }

    if (action === "versions") {
      const modelId = intParam(searchParams, "modelId", Number.MAX_SAFE_INTEGER);
      const year = intParam(searchParams, "year", 2100);
      if (!modelId) return NextResponse.json({ error: "modelId invalido" }, { status: 400 });
      if (!year) return NextResponse.json({ error: "year invalido" }, { status: 400 });
      const data = await fetchVehicleVersions(modelId, year);
      logConsult(request, { step: "versions", vehicleType: "Auto", year });
      return NextResponse.json({ data });
    }

    if (action === "value") {
      const versionId = intParam(searchParams, "versionId", Number.MAX_SAFE_INTEGER);
      const year = intParam(searchParams, "year", 2100);
      if (!versionId) return NextResponse.json({ error: "versionId invalido" }, { status: 400 });
      if (!year) return NextResponse.json({ error: "year invalido" }, { status: 400 });
      const data = await fetchVehicleValueARS(versionId, year);
      logConsult(request, { step: "value", vehicleType: "Auto", year, vehicleValueARS: data });
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "action invalida" }, { status: 400 });
  } catch (err) {
    console.error("Error en vehicle-lookup", err);
    const message = err instanceof Error ? err.message : "Error consultando valuacion";
    logConsult(request, { step: (action as "brands") ?? "brands", vehicleType: "Auto", error: message });
    return NextResponse.json({ error: "Error consultando valuacion" }, { status: 502 });
  }
}
