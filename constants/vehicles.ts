export type VehicleType = "Auto" | "Moto";
export type BrandTier = "economy" | "mid" | "premium";

export interface VehicleBrand {
  name: string;
  tier: BrandTier;
  models: string[];
}

// Nota: CAR_BRANDS ya no existe aca. Para Auto, marca/modelo/version y valor
// real se consultan contra el catalogo propio (CCA) via /api/vehicle-lookup
// (ver components/shared/Cotizador.tsx y lib/vehicle-valuation.ts).

export const MOTO_BRANDS: VehicleBrand[] = [
  { name: "Bajaj", tier: "economy", models: ["Rouser NS200", "Rouser 200", "Rouser 135", "Boxer 150", "Discover 125", "Dominar 400"] },
  { name: "Corven", tier: "economy", models: ["Triax 150", "Energy 110", "Hunter 250", "Expert 150", "ZL 150"] },
  { name: "Gilera", tier: "economy", models: ["VC 200", "SMX 200", "Fuoco 200", "Coyote"] },
  { name: "Guerrero", tier: "economy", models: ["GLR 110", "Trip 110", "Trip 150", "G110 Trip", "Gladiator"] },
  { name: "Honda", tier: "mid", models: ["Wave 110", "CB1", "CB125F Twister", "CB250 Twister", "XR150L", "CG150 Titan", "CB300F Twister"] },
  { name: "Kawasaki", tier: "premium", models: ["Ninja 400", "Z400", "Versys 650", "Z900"] },
  { name: "Keller", tier: "economy", models: ["KN 110", "Stratus 150", "Crosser 150", "Advance 150"] },
  { name: "Mondial", tier: "economy", models: ["HD 200", "MD 170", "RD 150", "Vento 150", "MB 250"] },
  { name: "Motomel", tier: "economy", models: ["Blitz 110", "Skua 150", "S2 150", "CG 150", "B110"] },
  { name: "Royal Enfield", tier: "premium", models: ["Classic 350", "Meteor 350", "Himalayan", "Bullet 350"] },
  { name: "Suzuki", tier: "mid", models: ["Gixxer 150", "GSX-S750", "V-Strom 650", "Burgman 400"] },
  { name: "Yamaha", tier: "mid", models: ["FZ 150", "FZ25", "MT-03", "XTZ 250", "Crypton", "YBR 125", "Ténéré 250"] },
  { name: "Zanella", tier: "economy", models: ["ZB 110", "RX 150", "ZR 150", "Styler 150", "Due 110"] },
];
