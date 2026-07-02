import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name — required, since the button is icon-only. */
  label: string;
  badge?: number;
}

/** Icon-only button with an accessible label and optional count badge. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, badge, className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors duration-300 ease-luxe hover:text-burgundy",
          className,
        )}
        {...props}
      >
        {children}
        {typeof badge === "number" && badge > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-burgundy px-1 text-[10px] font-semibold leading-none text-ivory">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </button>
    );
  },
);
