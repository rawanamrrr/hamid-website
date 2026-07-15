"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/lib/auth/actions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Dictionary, Locale } from "@/lib/i18n";

interface NavUser {
  name?: string | null;
  email?: string | null;
  permissions: string[];
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
  const [navOpen, setNavOpen] = useState(false);

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/menu", label: dict.nav.menu },
    { href: "/store", label: dict.nav.store },
    { href: "/coffee", label: dict.nav.coffee },
    { href: "/about", label: dict.nav.about },
    { href: "/branches", label: dict.nav.branches },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNav = () => setNavOpen((prev) => !prev);
  const closeNav = () => setNavOpen(false);

  const navBg = navOpen
    ? "bg-[#fff8f4] border-b border-[#e8d5bc]/60"
    : scrolled
    ? "bg-[#fff8f4]/85 backdrop-blur-md shadow-sm border-b border-[#e8d5bc]/40"
    : "bg-[#fff8f4]/95 border-b border-[#e8d5bc]/10";

  const navPy = scrolled ? "py-1 md:py-1.5" : "py-2.5 md:py-3";
  const canAccessDashboard = !!user?.permissions.includes("dashboard.view");

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navBg}`}>
      {/* ── Top bar ── */}
      <div className={`px-5 md:px-16 max-w-[1280px] mx-auto w-full transition-all duration-300 ease-in-out ${navPy}`}>

        {/* Mobile row: hamburger | logo | bag */}
        <div className="flex items-center justify-between md:hidden">
          {/* Hamburger */}
          <button
            type="button"
            onClick={toggleNav}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            className="w-10 h-10 flex items-center justify-center text-[#271908] hover:text-[#7b5800] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-2xl select-none">
              {navOpen ? "close" : "menu"}
            </span>
          </button>

          {/* Logo – sits naturally in the centre of the flex row */}
          <Link href="/" onClick={closeNav} className="flex items-center">
            <Image
              src="/hamid-logo.png"
              alt="Hamid Afandi"
              width={80}
              height={27}
              className="object-contain"
              priority
            />
          </Link>

          {/* Shopping bag */}
          <Link
            href="/cart"
            aria-label={dict.nav.cart}
            className="relative w-10 h-10 flex items-center justify-center text-[#271908] hover:text-[#7b5800] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-2xl select-none">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1 end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7b5800] px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop row: links | logo | actions */}
        <div className="hidden md:grid md:grid-cols-3 items-center">
          {/* Left: nav links */}
          <div className="flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
                  pathname === href
                    ? "text-[#7b5800] border-b-2 border-[#7b5800] pb-1"
                    : "text-[#271908] hover:text-[#7b5800]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Center: logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/hamid-logo.png"
                alt="Hamid Afandi"
                width={90}
                height={30}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right: language, auth, bag + CTA */}
          <div className="flex items-center justify-end gap-4">
            <LanguageSwitcher locale={locale} className="text-[#271908] hover:text-[#7b5800] text-xs font-semibold uppercase tracking-widest transition-colors" />

            {user ? (
              <div className="flex items-center gap-4">
                {canAccessDashboard && (
                  <Link href="/admin" className="text-xs font-semibold uppercase tracking-widest text-[#271908] hover:text-[#7b5800]">
                    {dict.nav.dashboard}
                  </Link>
                )}
                <Link href="/account" className="text-xs font-semibold uppercase tracking-widest text-[#271908] hover:text-[#7b5800]">
                  {user.name || dict.nav.account}
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="text-xs font-semibold uppercase tracking-widest text-[#271908] hover:text-[#7b5800]">
                    {dict.nav.logout}
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="text-xs font-semibold uppercase tracking-widest text-[#271908] hover:text-[#7b5800]">
                {dict.nav.login}
              </Link>
            )}

            <Link
              href="/cart"
              aria-label={dict.nav.cart}
              className="relative material-symbols-outlined text-[#271908] hover:text-[#7b5800] transition-colors text-base"
            >
              shopping_bag
              {cartCount > 0 && (
                <span className="absolute -top-2 -end-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7b5800] px-1 font-sans text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/store"
              className="bg-[#7b5800] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#765400] transition-colors"
            >
              {dict.nav.orderNow}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {navOpen && (
        <div className="md:hidden bg-[#fff8f4] border-t border-[#e8d5bc]/60 px-5 py-6 space-y-1">
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
                  {user.name || dict.nav.account}
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
      )}
    </nav>
  );
}
