import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

/** Labeled text input with brand-consistent focus + error states. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="eyebrow text-mauve">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          "w-full rounded-sm border bg-white/60 px-4 py-3 font-sans text-[14px] text-ink placeholder:text-mauve/60",
          "transition-colors duration-300 ease-luxe focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy",
          error ? "border-red-400" : "border-burgundy/15",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-[12px] text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-[12px] text-mauve">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
