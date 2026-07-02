import { cn } from "@/lib/utils";

/**
 * LUVORA brand mark = a line-drawn heart + a separate "golden" dot floating
 * above it. Keeping the dot as its own element (rather than baked into the SVG)
 * lets the intro animation reveal it independently, while the header/footer
 * render the exact same structure so the shared-layout morph stays seamless.
 */

const HEART_PATH =
  "M12 21 C 5 14.5, 3.2 9.5, 6.6 7 C 9.2 5.2, 11.4 6.7, 12 8.6 C 12.6 6.7, 14.8 5.2, 17.4 7 C 20.8 9.5, 19 14.5, 12 21 Z";

export function HeartMark({
  className,
  stroke = "#6B1E3A",
  strokeWidth = 1.4,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      data-brand-heart
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <path d={HEART_PATH} />
    </svg>
  );
}

/**
 * The brand mark: heart + floating gold dot, sized by `size` (px).
 * `dot` toggles the dot (the intro hides it initially, then reveals it).
 */
export function BrandMark({
  size = 28,
  stroke = "#6B1E3A",
  dotColor = "#D9B48C",
  className,
  showDot = true,
}: {
  size?: number;
  stroke?: string;
  dotColor?: string;
  className?: string;
  showDot?: boolean;
}) {
  const dotSize = Math.max(3, Math.round(size * 0.12));
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <HeartMark stroke={stroke} strokeWidth={1.4} />
      {showDot && (
        <span
          data-brand-dot
          aria-hidden="true"
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            background: dotColor,
            transform: "translate(-50%, -8%)",
          }}
        />
      )}
    </span>
  );
}

export function Wordmark({
  className,
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      data-brand-word
      className={cn("font-display leading-none", className)}
      style={{ letterSpacing: "0.3em", color }}
    >
      LUVORA
    </span>
  );
}

/**
 * Horizontal lockup used by the header, footer and the intro overlay.
 * Same DOM in every location → Framer Motion's shared-layout morph is clean.
 */
export function BrandLockup({
  markSize = 28,
  wordClassName = "text-[23px]",
  wordColor = "#1F1F1F",
  stroke = "#6B1E3A",
  dotColor = "#D9B48C",
  showDot = true,
  className,
}: {
  markSize?: number;
  wordClassName?: string;
  wordColor?: string;
  stroke?: string;
  dotColor?: string;
  showDot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BrandMark size={markSize} stroke={stroke} dotColor={dotColor} showDot={showDot} />
      <Wordmark className={wordClassName} color={wordColor} />
    </span>
  );
}
