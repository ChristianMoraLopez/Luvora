import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "outlineDark" | "solid" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase tracking-nav text-center transition-all duration-300 ease-luxe disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  // Champagne fill on burgundy text — the house primary CTA.
  primary: "bg-champagne text-burgundy hover:bg-champagne-gold",
  // Solid burgundy — used on light backgrounds (add-to-cart).
  solid: "bg-burgundy text-ivory hover:bg-burgundy-deep",
  // Outline on light surfaces.
  outline: "border border-burgundy/40 text-burgundy hover:border-burgundy hover:bg-burgundy/[0.03]",
  // Outline on dark surfaces (hero on burgundy).
  outlineDark:
    "border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/[0.06]",
  ghost: "text-burgundy hover:text-burgundy-deep",
};

const sizes: Record<Size, string> = {
  sm: "text-[11px] px-5 py-3",
  md: "text-[12px] px-[30px] py-4",
  lg: "text-[13px] px-9 py-[18px]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", href, fullWidth, className, children, ...props },
  ref,
) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});
