import ConsultsSection from "@/components/admin/ConsultsSection";

export default async function MotosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  return <ConsultsSection vehicleType="Moto" searchParams={await searchParams} />;
}
