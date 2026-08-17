export type VehicleType = "Auto" | "Moto";
export type BrandTier = "economy" | "mid" | "premium";

export interface VehicleBrand {
  name: string;
  tier: BrandTier;
  models: string[];
}

export const CAR_BRANDS: VehicleBrand[] = [
  { name: "Alfa Romeo", tier: "premium", models: ["Giulietta", "Giulia", "Stelvio", "Mito"] },
  { name: "Audi", tier: "premium", models: ["A1", "A3", "A4", "A5", "Q3", "Q5", "Q7", "Q8"] },
  { name: "BMW", tier: "premium", models: ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "X1", "X2", "X3", "X4", "X5"] },
  { name: "Chevrolet", tier: "economy", models: ["Onix", "Onix Plus", "Cruze", "Prisma", "Corsa", "Tracker", "Spin", "S10", "Captiva"] },
  { name: "Chrysler", tier: "economy", models: ["300C", "Grand Caravan", "PT Cruiser"] },
  { name: "Citroen", tier: "economy", models: ["C3", "C3 Aircross", "C4 Cactus", "C4 Lounge", "Berlingo"] },
  { name: "Dodge", tier: "economy", models: ["Journey", "Durango"] },
  { name: "Fiat", tier: "economy", models: ["Cronos", "Argo", "Mobi", "Pulse", "Toro", "Strada", "Uno", "Palio", "Ducato"] },
  { name: "Ford", tier: "mid", models: ["Ka", "Fiesta", "Focus", "EcoSport", "Ranger", "Territory", "Mondeo"] },
  { name: "Honda", tier: "mid", models: ["Civic", "City", "Fit", "HR-V", "CR-V", "WR-V"] },
  { name: "Hyundai", tier: "mid", models: ["HB20", "Creta", "Tucson", "Santa Fe", "i10", "Accent"] },
  { name: "Iveco", tier: "premium", models: ["Daily"] },
  { name: "Jaguar", tier: "premium", models: ["XE", "XF", "F-Pace", "E-Pace"] },
  { name: "Jeep", tier: "premium", models: ["Renegade", "Compass", "Commander", "Wrangler", "Cherokee"] },
  { name: "Kia", tier: "mid", models: ["Rio", "Cerato", "Sportage", "Sorento", "Picanto", "Soul"] },
  { name: "Land Rover", tier: "premium", models: ["Discovery", "Discovery Sport", "Range Rover Evoque", "Range Rover Sport", "Defender"] },
  { name: "Mercedes-Benz", tier: "premium", models: ["Clase A", "Clase C", "Clase E", "GLA", "GLC", "GLE", "Sprinter"] },
  { name: "Mitsubishi", tier: "mid", models: ["L200", "ASX", "Outlander", "Eclipse Cross"] },
  { name: "Nissan", tier: "mid", models: ["Versa", "Sentra", "Kicks", "Frontier", "March"] },
  { name: "Peugeot", tier: "economy", models: ["208", "2008", "3008", "308", "408", "Partner"] },
  { name: "RAM", tier: "premium", models: ["1500", "700", "2500"] },
  { name: "Renault", tier: "economy", models: ["Kwid", "Sandero", "Sandero Stepway", "Logan", "Duster", "Captur", "Alaskan", "Oroch"] },
  { name: "Subaru", tier: "mid", models: ["Forester", "Outback", "XV", "Impreza"] },
  { name: "Suzuki", tier: "economy", models: ["Fun", "Swift", "Vitara", "S-Presso"] },
  { name: "Toyota", tier: "mid", models: ["Corolla", "Corolla Cross", "Etios", "Hilux", "SW4", "Yaris", "RAV4"] },
  { name: "Volkswagen", tier: "mid", models: ["Gol", "Gol Trend", "Polo", "Virtus", "Nivus", "Taos", "Amarok", "Suran", "Vento"] },
  { name: "Volvo", tier: "premium", models: ["XC40", "XC60", "XC90", "S60"] },
];

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
