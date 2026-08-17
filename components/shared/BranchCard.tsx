import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

interface Branch {
  address: string;
  phones: string[];
  cell: string;
  email: string;
}

export default function BranchCard({
  branch,
  index,
}: {
  branch: Branch;
  index: number;
}) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(branch.address)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(branch.address)}&output=embed`;

  return (
    <div className="overflow-hidden border border-gray-100 bg-white">
      <div className="h-40 w-full overflow-hidden bg-gray-100">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa - ${branch.address}`}
        />
      </div>
      <div className="p-5">
        <p className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
          Sucursal {index + 1}
        </p>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <MapPin className="text-brand-accent h-3.5 w-3.5 shrink-0" />
          {branch.address}
        </a>
        <div className="mt-4 space-y-2">
          {branch.phones.map((p) => (
            <a
              key={p}
              href={`tel:${p}`}
              className="hover:text-brand-accent flex items-center gap-2 text-sm text-gray-600 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              {p}
            </a>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <a
            href={`https://wa.me/${branch.cell}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-whatsapp/10 text-whatsapp hover:bg-whatsapp/20 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200"
          >
            <MapPin className="h-3.5 w-3.5" />
            Como llegar
          </a>
        </div>
        <a
          href={`mailto:${branch.email}`}
          className="hover:text-brand-accent mt-3 flex items-center gap-2 text-sm text-gray-600 transition-colors"
        >
          <Mail className="h-3.5 w-3.5" />
          {branch.email}
        </a>
      </div>
    </div>
  );
}
