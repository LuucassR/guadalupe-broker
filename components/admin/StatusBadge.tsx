import { CheckCircle2, CircleDashed } from "lucide-react";

export default function StatusBadge({ status }: { status: string }) {
  const complete = status === "complete";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        complete
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15"
          : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/15"
      }`}
    >
      {complete ? <CheckCircle2 className="size-3.5" /> : <CircleDashed className="size-3.5" />}
      {complete ? "Completa" : "Incompleta"}
    </span>
  );
}
