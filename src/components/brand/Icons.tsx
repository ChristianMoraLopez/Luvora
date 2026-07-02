import type { SVGProps } from "react";

/**
 * LUVORA line-icon set — hand-drawn, stroke-based, brand-appropriate.
 * Extracted from the design handoff (search / account / bag / trust badges)
 * and extended with the icons the shop UI needs. All use `currentColor` so
 * they inherit text color; default stroke-width 1.5 (1.3 for large badges).
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 24, strokeWidth = 1.5, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M15.6 15.6 L20 20" />
  </Icon>
);

export const AccountIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20 a7 7 0 0 1 14 0" />
  </Icon>
);

export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="8" width="14" height="12" rx="1.5" />
    <path d="M9 8 V6.5 a3 3 0 0 1 6 0 V8" />
  </Icon>
);

export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Icon {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 21 C 5 14.5, 3.2 9.5, 6.6 7 C 9.2 5.2, 11.4 6.7, 12 8.6 C 12.6 6.7, 14.8 5.2, 17.4 7 C 20.8 9.5, 19 14.5, 12 21 Z" />
  </Icon>
);

/* ── Trust badge icons (stroke-width 1.3 in use) ── */
export const DiscretionIcon = (p: IconProps) => (
  <Icon strokeWidth={1.3} {...p}>
    <rect x="6" y="11" width="12" height="9" rx="1.5" />
    <path d="M9 11 V8 a3 3 0 0 1 6 0 v3" />
  </Icon>
);

export const PackageIcon = (p: IconProps) => (
  <Icon strokeWidth={1.3} {...p}>
    <path d="M12 3 L21 7.5 V16.5 L12 21 L3 16.5 V7.5 Z" />
    <path d="M3 7.5 L12 12 L21 7.5" />
    <path d="M12 12 V21" />
  </Icon>
);

export const QualityIcon = (p: IconProps) => (
  <Icon strokeWidth={1.3} {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="M9.2 13.8 L7.5 21 L12 18.5 L16.5 21 L14.8 13.8" />
  </Icon>
);

/* ── UI icons ── */
export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9 L12 15 L18 9" />
  </Icon>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 6 L15 12 L9 18" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12 H20" />
    <path d="M14 6 L20 12 L14 18" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5 V19" />
    <path d="M5 12 H19" />
  </Icon>
);

export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12 H19" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6 L18 18" />
    <path d="M18 6 L6 18" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7 H20" />
    <path d="M4 12 H20" />
    <path d="M4 17 H20" />
  </Icon>
);

export const FilterIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 5 H21" />
    <path d="M6 12 H18" />
    <path d="M10 19 H14" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12.5 L10 17.5 L19 6.5" />
  </Icon>
);

export const TruckIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="7" width="12" height="9" rx="1.2" />
    <path d="M14 10 H18 L21 13 V16 H14 Z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </Icon>
);

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3 L19 6 V11 C19 15.5 16 19 12 21 C8 19 5 15.5 5 11 V6 Z" />
    <path d="M9 11.5 L11.2 13.7 L15 9.5" />
  </Icon>
);
