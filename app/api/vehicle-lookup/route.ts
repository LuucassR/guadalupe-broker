import { NextResponse } from "next/server";
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
      return NextResponse.json({ data: await fetchVehicleBrands() });
    }

    if (action === "models") {
      const brandId = Number(searchParams.get("brandId"));
      const year = Number(searchParams.get("year"));
      if (!brandId) return NextResponse.json({ error: "brandId invalido" }, { status: 400 });
      if (!year) return NextResponse.json({ error: "year invalido" }, { status: 400 });
      return NextResponse.json({ data: await fetchVehicleModels(brandId, year) });
    }

    if (action === "versions") {
      const modelId = Number(searchParams.get("modelId"));
      const year = Number(searchParams.get("year"));
      if (!modelId) return NextResponse.json({ error: "modelId invalido" }, { status: 400 });
      if (!year) return NextResponse.json({ error: "year invalido" }, { status: 400 });
      return NextResponse.json({ data: await fetchVehicleVersions(modelId, year) });
    }

    if (action === "value") {
      const versionId = Number(searchParams.get("versionId"));
      const year = Number(searchParams.get("year"));
      if (!versionId) return NextResponse.json({ error: "versionId invalido" }, { status: 400 });
      if (!year) return NextResponse.json({ error: "year invalido" }, { status: 400 });
      return NextResponse.json({ data: await fetchVehicleValueARS(versionId, year) });
    }

    return NextResponse.json({ error: "action invalida" }, { status: 400 });
  } catch (err) {
    console.error("Error en vehicle-lookup", err);
    const message = err instanceof Error ? err.message : "Error consultando valuacion";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
