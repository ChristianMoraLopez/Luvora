import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/brand/Icons";

export function SectionHeader({
  eyebrow,
  title,
  link,
  align = "row",
}: {
  eyebrow: string;
  title: string;
  link?: { href: string; label: string };
  align?: "row" | "center";
}) {
  if (align === "center") {
    return (
      <Reveal className="mx-auto mb-11 flex max-w-prose flex-col items-center gap-3 text-center">
        <span className="eyebrow text-burgundy">{eyebrow}</span>
        <h2 className="font-display text-[clamp(30px,3.4vw,42px)] text-ink">{title}</h2>
      </Reveal>
    );
  }

  return (
    <Reveal className="mb-11 flex flex-wrap items-end justify-between gap-6">
      <div className="flex flex-col gap-3">
        <span className="eyebrow text-burgundy">{eyebrow}</span>
        <h2 className="font-display text-[clamp(30px,3.4vw,42px)] text-ink">{title}</h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-2 border-b border-burgundy pb-1 text-[12px] font-semibold uppercase tracking-nav text-burgundy"
        >
          {link.label}
          <ArrowRightIcon size={16} className="transition-transform duration-300 ease-luxe group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
