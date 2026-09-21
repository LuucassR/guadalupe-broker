import { NextResponse } from "next/server";
import { logConsult } from "@/lib/consult-log";
import {
  fetchVehicleBrands,
  fetchVehicleModels,
  fetchVehicleVersions,
  fetchVehicleValueARS,
} from "@/lib/vehicle-valuation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "brands") {
      const data = await fetchVehicleBrands();
      logConsult(request, { step: "brands", vehicleType: "Auto" });
      return NextResponse.json({ data });
    }

    if (action === "models") {
      const brandId = Number(searchParams.get("brandId"));
      const year = Number(searchParams.get("year"));
      if (!brandId) return NextResponse.json({ error: "brandId invalido" }, { status: 400 });
      if (!year) return NextResponse.json({ error: "year invalido" }, { status: 400 });
      const data = await fetchVehicleModels(brandId, year);
      const brand = (await fetchVehicleBrands()).find((b) => b.id === brandId);
      logConsult(request, { step: "models", vehicleType: "Auto", brand: brand?.name, year });
      return NextResponse.json({ data });
    }

    if (action === "versions") {
      const modelId = Number(searchParams.get("modelId"));
      const year = Number(searchParams.get("year"));
      if (!modelId) return NextResponse.json({ error: "modelId invalido" }, { status: 400 });
      if (!year) return NextResponse.json({ error: "year invalido" }, { status: 400 });
      const data = await fetchVehicleVersions(modelId, year);
      logConsult(request, { step: "versions", vehicleType: "Auto", year });
      return NextResponse.json({ data });
    }

    if (action === "value") {
      const versionId = Number(searchParams.get("versionId"));
      const year = Number(searchParams.get("year"));
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
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
