import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";

export default function GoogleRatingCard() {
  return (
    <div className="border border-gray-100 bg-white p-6 text-center">
      <div className="mb-2 flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-brand-dark text-3xl font-bold">4.9</p>
      <p className="mt-1 text-sm text-gray-600">
        Calificacion general en Google
      </p>
      <Link
        href={SITE_CONFIG.googleReviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        prefetch={true}
        className="text-brand-accent mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Ver opiniones en Google
      </Link>
    </div>
  );
}
