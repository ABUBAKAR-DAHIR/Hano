"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { Cpu } from "lucide-react";

/** next/image with a soft placeholder if the file is missing. */
export default function ProductImage({
  src,
  alt,
  sizes,
  className,
  priority,
}: {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="flex h-full w-full items-center justify-center" role="img" aria-label={alt}>
        <span className="flex size-16 items-center justify-center rounded-2xl bg-card/70 text-accent-foreground">
          <Cpu className="size-7" />
        </span>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={clsx("object-contain", className)}
    />
  );
}