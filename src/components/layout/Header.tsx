"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { easing } from "@/config/tokens";
import { mainNav } from "@/config/site";
import { BrandLockup } from "@/components/brand/Logo";
import { IconButton } from "@/components/ui/IconButton";
import { SearchIcon, AccountIcon, BagIcon, MenuIcon } from "@/components/brand/Icons";
import { useCartStore, selectCount } from "@/store/cart";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";

/**
 * Sticky header. The logo is the destination of the intro's shared-layout
 * morph: while the intro plays, we render an invisible placeholder (no
 * `layoutId`) to hold the layout; once it completes, the real lockup mounts
 * with `layoutId="brand-lockup"` and Framer Motion flies it in from center.
 */
export function Header({
  playing = false,
  introComplete = true,
}: {
  playing?: boolean;
  introComplete?: boolean;
}) {
  const pathname = usePathname();
  const count = useCartStore(selectCount);
  const openCart = useCartStore((s) => s.open);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Nav + icons: hidden behind the intro overlay while playing, then fade in.
  const chromeVisible = !playing;

  const chrome = {
    initial: false as const,
    animate: { opacity: chromeVisible ? 1 : 0, y: chromeVisible ? 0 : -4 },
    transition: { duration: 0.6, ease: easing.luxe, delay: introComplete && !playing ? 0.2 : 0 },
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-ivory/90 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
        <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-gutter py-[18px]">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-2">
            <motion.div className="md:hidden" {...chrome}>
              <IconButton label="Abrir menú" onClick={() => setMenuOpen(true)}>
                <MenuIcon size={22} />
              </IconButton>
            </motion.div>

            <Link href="/" aria-label="LUVORA — Inicio" className="inline-flex items-center">
              {/*
                The logo only claims `layoutId` once the intro is complete, so
                Framer Motion morphs it IN from the overlay (forward only). Before
                that it renders plain — visible for SSR/no-JS, hidden while the
                overlay covers it. The `key` forces a clean remount at hand-off.
              */}
              <motion.span
                key={introComplete ? "shared" : "plain"}
                layoutId={introComplete ? "brand-lockup" : undefined}
                className={cn("inline-flex", playing && "opacity-0")}
                aria-hidden={playing || undefined}
              >
                <BrandLockup markSize={28} wordClassName="text-[23px]" />
              </motion.span>
            </Link>
          </div>

          {/* Center: primary nav */}
          <motion.nav
            className="hidden items-center gap-[clamp(18px,3vw,36px)] md:flex"
            {...chrome}
          >
            {mainNav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-[12px] font-medium uppercase tracking-nav transition-colors duration-300 ease-luxe hover:text-burgundy",
                    active
                      ? "border-b border-burgundy pb-[3px] font-semibold text-burgundy"
                      : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.nav>

          {/* Right: actions */}
          <motion.div className="flex items-center gap-1" {...chrome}>
            <IconButton label="Buscar" onClick={() => setSearchOpen(true)}>
              <SearchIcon size={20} />
            </IconButton>
            <Link
              href="/cuenta"
              aria-label="Mi cuenta"
              title="Mi cuenta"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors duration-300 ease-luxe hover:text-burgundy"
            >
              <AccountIcon size={20} />
            </Link>
            <IconButton label="Carrito" badge={count} onClick={openCart}>
              <BagIcon size={20} />
            </IconButton>
          </motion.div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
