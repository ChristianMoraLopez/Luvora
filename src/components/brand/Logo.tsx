import { cn } from "@/lib/utils";

/**
 * LUVORA brand mark — the official attached logo icon (Logo Icon.zip → Group 1.svg):
 * a heart drawn as two flowing strokes with an inner flame/leaf. A separate
 * "golden" dot (attached Ellipse) floats above it.
 *
 * Keeping the dot as its own element lets the intro animation reveal it
 * independently, while the header/footer render the same structure so the
 * shared-layout morph stays seamless.
 */

export const HEART_VIEWBOX = "0 0 319 293";

/** Outer heart outline (Group 1.svg, path 2). */
const HEART_OUTER =
  "M160.039 52.5399C160.039 52.5399 172.843 36.8466 183.039 29.0399C192.346 21.9135 198.178 18.4507 209.039 14.0399C223.09 8.33361 231.879 5.63171 247.039 6.03991C260.484 6.40194 268.862 7.36398 280.539 14.0399C288.353 18.5075 292.348 22.0661 298.039 29.0399C305.327 37.9707 308.525 44.2902 311.039 55.5399C313.381 66.0209 312.779 72.4424 311.039 83.0399C309.338 93.3983 306.707 98.9059 302.539 108.54C298.028 118.966 295.009 124.702 288.539 134.04C281.603 144.05 276.483 148.764 268.039 157.54C259.131 166.798 253.733 171.609 244.039 180.04C236.606 186.504 232.036 189.65 224.539 196.04C215.172 204.024 201.039 217.04 201.039 217.04C201.039 217.04 189.442 228.391 183.039 236.54C177.217 243.95 173.82 248.145 169.539 256.54C166.754 261.999 165.521 265.241 163.539 271.04C161.556 276.839 160.039 290.04 160.039 285.54C160.039 285.54 156.939 276.598 155.039 271.04C153.056 265.241 151.823 261.999 149.039 256.54C144.757 248.145 141.361 243.95 135.539 236.54C129.136 228.391 124.896 224.339 117.539 217.04C117.539 217.04 103.406 204.024 94.0388 196.04C86.542 189.65 81.9719 186.504 74.5388 180.04C64.8445 171.609 59.4466 166.798 50.5388 157.54C42.0948 148.764 36.975 144.05 30.0388 134.04C23.5685 124.702 20.55 118.966 16.0388 108.54C11.8705 98.9059 9.23945 93.3983 7.53882 83.0399C5.79893 72.4424 5.19698 66.0209 7.53882 55.5399C10.0524 44.2902 13.2509 37.9707 20.5388 29.0399C26.2298 22.0661 30.2247 18.5075 38.0388 14.0399C49.7156 7.36397 58.0933 6.40194 71.5388 6.03991C86.6986 5.63172 95.4881 8.33361 109.539 14.0399C120.4 18.4507 126.232 21.9135 135.539 29.0399C145.735 36.8466 158.539 52.5399 158.539 52.5399";

/** Inner flame/leaf (Group 1.svg, path 1). */
const HEART_INNER =
  "M160.039 52.5399C160.039 52.5399 152.646 61.5526 149.039 68.0399C145.338 74.6956 144.114 78.8731 141.539 86.0399C138.782 93.7141 136.619 97.9573 135.539 106.04C134.634 112.814 134.944 116.732 135.539 123.54C135.986 128.657 137.539 136.54 137.539 136.54L141.539 146.54C143.825 149.994 145.526 151.845 149.039 154.04C152.704 156.331 155.217 157.54 159.539 157.54C163.861 157.54 166.482 156.495 170.039 154.04C173.229 151.838 174.429 149.791 176.539 146.54C178.871 142.948 179.773 140.631 181.039 136.54C182.557 131.633 182.839 128.673 183.039 123.54C183.306 116.666 182.158 112.827 181.039 106.04C179.736 98.1409 178.892 93.692 176.539 86.0399C174.322 78.8308 173.122 74.6768 169.539 68.0399C166.013 61.5084 163.54 58.0245 158.539 52.5399";

/** The raw heart artwork, filling its parent. Stroke width is in viewBox units. */
export function HeartArt({
  className,
  stroke = "#6B1E3A",
  strokeWidth = 12,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      data-brand-heart
      viewBox={HEART_VIEWBOX}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <path d={HEART_OUTER} />
      <path d={HEART_INNER} />
    </svg>
  );
}

/** Alias kept for existing consumers (product placeholder, category tiles). */
export function HeartMark(props: { className?: string; stroke?: string; strokeWidth?: number }) {
  return <HeartArt {...props} />;
}

/**
 * The brand mark: heart + floating golden dot, sized by `size` (px width).
 * `showDot` toggles the dot (the intro hides it initially, then reveals it).
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
  const dotSize = Math.max(3, Math.round(size * 0.13));
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <HeartArt stroke={stroke} />
      {showDot && (
        <span
          data-brand-dot
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            left: "50%",
            marginLeft: -dotSize / 2,
            top: 0,
            transform: "translateY(-40%)",
            background: dotColor,
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
