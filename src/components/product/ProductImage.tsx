import Image from "next/image";
import { HeartMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

/**
 * Renders product photography when available, otherwise an on-brand
 * placeholder (champagne wash + heart monogram + name) — a premium stand-in
 * for the handoff's dashed boxes until real photos land in Supabase Storage.
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
  const isReal = !!src && /^(https?:)?\//.test(src) && !src.startsWith("placeholder");
  const aspect = ratio === "1/1" ? "aspect-square" : "aspect-[4/5]";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-card bg-champagne/40",
        aspect,
        className,
      )}
    >
      {isReal ? (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 50vw, 300px"}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            background:
              "linear-gradient(150deg, #F2E5E2 0%, #E8D9C5 55%, #D6A5B4 130%)",
          }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-3 opacity-70">
            <span className="h-9 w-9">
              <HeartMark stroke="#6B1E3A" strokeWidth={1.2} />
            </span>
            {label && (
              <span className="font-display text-lg text-burgundy/80">{label}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
