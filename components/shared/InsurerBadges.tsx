"use client";

import { useState } from "react";
import Image from "next/image";
import { INSURERS } from "@/constants/site";
import Link from "next/link";

function InsurerCard({
  name,
  shortName,
  color,
  domain,
  image,
}: {
  name: string;
  shortName: string;
  color: string;
  domain: string;
  image: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`https://${domain}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-42.5 shrink-0 flex-col items-center gap-3 border border-gray-100 bg-white px-6 shadow-sm grayscale-100 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/50"
    >
      <div className="flex h-32 w-full items-center justify-center transition-colors">
        {imgError ? (
          <span
            className="text-lg font-bold tracking-tight grayscale-0"
            style={{ color }}
          >
            {shortName}
          </span>
        ) : (
          <Image
            src={image}
            alt={name}
            width={200}
            height={200}
            className="object-contain transition-all duration-300 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    </Link>
  );
}

export default function InsurerBadges() {
  return (
    <div className="relative flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="animate-marquee flex w-max gap-5 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[...INSURERS, ...INSURERS].map((insurer, index) => (
          <InsurerCard key={`${insurer.name}-${index}`} {...insurer} />
        ))}
      </div>
    </div>
  );
}
