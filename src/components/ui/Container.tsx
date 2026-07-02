import { cn } from "@/lib/utils";

/** Centered content column, max 1200px, fluid gutters. */
export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-content px-gutter", className)}>
      {children}
    </Tag>
  );
}
