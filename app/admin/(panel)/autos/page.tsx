import ConsultsSection from "@/components/admin/ConsultsSection";

export default async function AutosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  return <ConsultsSection vehicleType="Auto" searchParams={await searchParams} />;
}
