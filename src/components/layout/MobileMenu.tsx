"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { IconButton } from "@/components/ui/IconButton";
import { BrandLockup } from "@/components/brand/Logo";
import { CloseIcon } from "@/components/brand/Icons";
import { mainNav, footerNav } from "@/config/site";
import { cn } from "@/lib/utils";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <Drawer open={open} onClose={onClose} side="left" labelledBy="mobile-menu-title" className="max-w-[340px]">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-[18px]">
          <span id="mobile-menu-title" className="sr-only">
            Menú de navegación
          </span>
          <BrandLockup markSize={24} wordClassName="text-[19px]" />
          <IconButton label="Cerrar menú" onClick={onClose}>
            <CloseIcon size={22} />
          </IconButton>
        </div>

        <nav className="flex flex-col px-6 py-4">
          {mainNav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "border-b border-border py-4 font-display text-2xl transition-colors",
                  active ? "text-burgundy" : "text-ink hover:text-burgundy",
                )}
              >
                {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-6 border-b border-border px-6 py-4">
          <Link href="/cuenta" onClick={onClose} className="text-[13px] uppercase tracking-nav text-burgundy hover:opacity-70">
            Mi cuenta
          </Link>
          <Link href="/wishlist" onClick={onClose} className="text-[13px] uppercase tracking-nav text-burgundy hover:opacity-70">
            Favoritos
          </Link>
        </div>

        <div className="mt-auto space-y-3 px-6 py-6">
          <p className="eyebrow text-mauve">Categorías</p>
          <div className="flex flex-col gap-2.5">
            {footerNav.tienda.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="text-[13px] font-light text-ink/80 hover:text-burgundy"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
