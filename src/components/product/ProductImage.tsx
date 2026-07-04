"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HeartMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

/**
 * Renders product photography when available, otherwise an on-brand
 * placeholder (champagne wash + heart monogram + name).
 *
 * Feeds on real Supabase Storage URLs: if the object is missing (the bucket is
 * empty today) the `<Image>` `onError` swaps to the placeholder, so uploading
 * photos later "just works" with no code change.
 */
export function ProductImage({
  src,
  alt,
  label,
  ratio = "4/5",
  sizes,
  className,
  priority,
}: {
  src?: string;
  alt: string;
  label?: string;
  ratio?: "4/5" | "1/1";
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const isUrl = !!src && /^https?:\/\//.test(src);
  const [failed, setFailed] = useState(false);
  // Reset the error state if the src changes (e.g. gallery thumbnails).
  useEffect(() => setFailed(false), [src]);

  const showImage = isUrl && !failed;
  const aspect = ratio === "1/1" ? "aspect-square" : "aspect-[4/5]";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-card bg-champagne/40",
        aspect,
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 50vw, 300px"}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            background: "linear-gradient(150deg, #F2E5E2 0%, #E8D9C5 55%, #D6A5B4 130%)",
          }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-3 px-4 text-center opacity-70">
            <span className="h-10 w-10">
              <HeartMark stroke="#6B1E3A" />
            </span>
            {label && <span className="font-display text-lg text-burgundy/80">{label}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
