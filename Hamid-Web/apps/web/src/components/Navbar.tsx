"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AddedToCartDialog } from "@/components/AddedToCartDialog";
import { subscribeAddedToCart, type AddedToCartPayload } from "@/lib/cart/added-to-cart-bus";
import type { Dictionary, Locale } from "@/lib/i18n";

interface NavUser {
  name?: string | null;
  email?: string | null;
  permissions: string[];
}

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute top-0.5 end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7b5800] px-1 text-[10px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Navbar({
  dict,
  locale,
  user,
  cartCount,
}: {
  dict: Dictionary;
  locale: Locale;
  user: NavUser | null;
  cartCount: number;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState<AddedToCartPayload | null>(null);

  useEffect(() => subscribeAddedToCart(setAddedToCart), []);

  const addedToCartDialog = (
    <AddedToCartDialog
      open={!!addedToCart}
      onClose={() => setAddedToCart(null)}
      productName={addedToCart?.name}
      productImage={addedToCart?.image}
      productMeta={addedToCart?.meta}
      labels={{
        title: dict.product.addedToCartTitle,
        continueShopping: dict.product.continueShopping,
        goToCart: dict.product.goToCart,
      }}
    />
  );

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/menu", label: dict.nav.menu },
    { href: "/store", label: dict.nav.store },
    { href: "/coffee", label: dict.nav.coffee },
    { href: "/about", label: dict.nav.about },
    { href: "/branches", label: dict.nav.branches },
  ];

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Hide when scrolling down past the header, reveal on any scroll up.
      // The small delta threshold avoids flickering from momentum jitter.
      if (y < 80) {
        setHidden(false);
      } else if (y - lastY > 6) {
        setHidden(true);
      } else if (lastY - y > 6) {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sticky elements further down the page (e.g. the menu's section nav) dock
  // against the header via this variable instead of a hard-coded offset.
  const navRef = useRef<HTMLElement>(null);
  // The "Added to cart" toast is anchored to the cart icon in this header, so
  // it needs the header on screen to anchor to — force it visible for as
  // long as the toast is up, even if the shopper had scrolled it away, and
  // let it resume normal scroll-hide behavior the moment the toast closes.
  const navVisible = !hidden || navOpen || !!addedToCart;
  useEffect(() => {
    const height = navVisible ? navRef.current?.offsetHeight ?? 60 : 0;
    document.documentElement.style.setProperty("--nav-offset", `${height}px`);
  }, [navVisible, scrolled]);

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [navOpen]);

  const toggleNav = () => setNavOpen((prev) => !prev);
  const closeNav = () => setNavOpen(false);

  const navBg = navOpen
    ? "bg-[#fff8f4] border-b border-[#e8d5bc]/60"
    : scrolled
    ? "bg-[#fff8f4]/85 backdrop-blur-md shadow-sm border-b border-[#e8d5bc]/40"
    : "bg-[#fff8f4]/95 border-b border-[#e8d5bc]/10";

  const navPy = scrolled ? "py-1 md:py-1.5" : "py-2 md:py-2.5";
  const canAccessDashboard = !!user?.permissions.includes("dashboard.view");

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navBg} ${
        navVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* ── Top bar ── */}
      <div className={`px-4 md:px-16 max-w-[1280px] mx-auto w-full transition-all duration-300 ease-in-out ${navPy}`}>

        {/* Mobile row: hamburger | logo | bag */}
        <div className="flex items-center justify-between lg:hidden">
          {/* Hamburger */}
          <button
            type="button"
            onClick={toggleNav}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            className="w-11 h-11 -ms-1.5 flex items-center justify-center text-[#271908] active:text-[#7b5800] transition-colors shrink-0"
          >
            {navOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
          </button>

          {/* Logo – sits naturally in the centre of the flex row */}
          <Link href="/" onClick={closeNav} className="flex items-center" aria-label="Hamid Afandi — home">
            <Image
              src="/hamid-logo.png"
              alt="Hamid Afandi"
              width={48}
              height={48}
              className="h-12 w-12 object-contain drop-shadow-sm"
              priority
            />
          </Link>

          {/* Shopping bag */}
          <div className="relative -me-1.5 shrink-0">
            <Link
              href="/cart"
              aria-label={dict.nav.cart}
              className="relative w-11 h-11 flex items-center justify-center text-[#271908] active:text-[#7b5800] transition-colors"
            >
              <ShoppingBag size={22} strokeWidth={2} />
              <CartBadge count={cartCount} />
            </Link>
            {addedToCartDialog}
          </div>
        </div>

        {/* Desktop row: links | logo | actions. 1fr|auto|1fr keeps the logo
            centred while giving the link/action columns real space — with
            equal thirds the six links overflowed under the logo cell, which
            silently swallowed clicks on the last link (Branches). */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: nav links */}
          <div className="flex items-center gap-5 xl:gap-7">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                  pathname === href
                    ? "text-[#7b5800] border-b-2 border-[#7b5800] pb-1"
                    : "text-[#271908] hover:text-[#7b5800]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Center: logo (wrapper is click-transparent so it can never mask
              neighbouring links; the logo link itself stays clickable) */}
          <div className="flex justify-center pointer-events-none px-6">
            <Link href="/" className="flex items-center pointer-events-auto" aria-label="Hamid Afandi — home">
              <Image
                src="/hamid-logo.png"
                alt="Hamid Afandi"
                width={56}
                height={56}
                className="h-14 w-14 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Right: language, auth, bag + CTA */}
          <div className="flex items-center justify-end gap-3 xl:gap-4">
            <LanguageSwitcher locale={locale} className="shrink-0 whitespace-nowrap text-[#271908] hover:text-[#7b5800] text-xs font-semibold uppercase tracking-widest transition-colors" />

            {user ? (
              <div className="flex items-center gap-3 xl:gap-4">
                {canAccessDashboard && (
                  <Link href="/admin" className="shrink-0 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-[#271908] hover:text-[#7b5800]">
                    {dict.nav.dashboard}
                  </Link>
                )}
                <Link
                  href="/account"
                  className="shrink-0 max-w-[9rem] truncate text-xs font-semibold uppercase tracking-widest text-[#271908] hover:text-[#7b5800]"
                >
                  {dict.nav.account}
                </Link>
                <form action={logoutAction} className="shrink-0">
                  <button type="submit" className="whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-[#271908] hover:text-[#7b5800]">
                    {dict.nav.logout}
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="shrink-0 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-[#271908] hover:text-[#7b5800]">
                {dict.nav.login}
              </Link>
            )}

            <div className="relative shrink-0">
              <Link
                href="/cart"
                aria-label={dict.nav.cart}
                className="relative flex h-9 w-9 items-center justify-center text-[#271908] hover:text-[#7b5800] transition-colors"
              >
                <ShoppingBag size={18} strokeWidth={2} />
                <CartBadge count={cartCount} />
              </Link>
              {addedToCartDialog}
            </div>
            <Link
              href="/store"
              className="shrink-0 whitespace-nowrap bg-[#7b5800] text-white px-6 xl:px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#765400] transition-colors"
            >
              {dict.nav.orderNow}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer — overlays the page; backdrop closes it ── */}
      {navOpen && (
        <>
          {/* -z-10 keeps the backdrop behind the bar and drawer (both children of
              this stacking context) while it still overlays the page below. */}
          <div
            className="lg:hidden fixed inset-0 -z-10 bg-black/35"
            onClick={closeNav}
            aria-hidden="true"
          />
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#fff8f4] border-t border-[#e8d5bc]/60 px-5 py-5 space-y-1 shadow-[0_16px_32px_-16px_rgba(39,25,8,0.25)] max-h-[calc(100dvh-var(--nav-offset,60px))] overflow-y-auto">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeNav}
                className={`block py-3 text-sm font-semibold uppercase tracking-widest border-b border-[#e8d5bc]/40 transition-colors ${
                  pathname === href ? "text-[#7b5800]" : "text-[#271908]"
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="flex items-center justify-between py-3 border-b border-[#e8d5bc]/40">
              {user ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {canAccessDashboard && (
                    <Link href="/admin" onClick={closeNav} className="text-sm font-semibold uppercase tracking-widest text-[#271908]">
                      {dict.nav.dashboard}
                    </Link>
                  )}
                  <Link href="/account" onClick={closeNav} className="text-sm font-semibold uppercase tracking-widest text-[#271908]">
                    {dict.nav.account}
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="text-sm font-semibold uppercase tracking-widest text-[#271908]">
                      {dict.nav.logout}
                    </button>
                  </form>
                </div>
              ) : (
                <Link href="/login" onClick={closeNav} className="text-sm font-semibold uppercase tracking-widest text-[#271908]">
                  {dict.nav.login}
                </Link>
              )}
              <LanguageSwitcher locale={locale} className="text-sm font-semibold uppercase tracking-widest text-[#7b5800]" />
            </div>

            <Link
              href="/store"
              onClick={closeNav}
              className="block mt-4 bg-[#7b5800] text-white text-center py-4 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#765400] transition-colors"
            >
              {dict.nav.orderNow}
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
