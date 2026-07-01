"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/coffee", label: "Coffee" },
  { href: "/about", label: "About" },
  { href: "/branches", label: "Branches" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const menuOpenRef = useRef(false);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      if (menuOpenRef.current) return;
      const currentY = window.scrollY;
      setVisible(currentY < lastY.current || currentY < 60);
      lastY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = () => {
    setMenuOpen(true);
    setVisible(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-[#fff8f4]/95 backdrop-blur-xl border-b border-[#e8d5bc]/60 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center px-5 md:px-16 py-1.5 md:py-2 max-w-[1280px] mx-auto">
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-[#271908]"
          onClick={() => menuOpen ? closeMenu() : openMenu()}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>

        <div className="flex items-center gap-10">
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/hamid-logo.png"
              alt="Hamid Afandi"
              width={90}
              height={30}
              className="object-contain"
              priority
            />
          </Link>
          <div className="hidden md:flex gap-8">
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
        </div>

        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-[#271908] hover:text-[#7b5800] transition-colors text-2xl md:text-base">
            search
          </button>
          <button className="material-symbols-outlined text-[#271908] hover:text-[#7b5800] transition-colors text-2xl md:text-base">
            shopping_bag
          </button>
          <Link
            href="/menu"
            className="hidden md:block bg-[#7b5800] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#765400] transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#fff8f4] border-t border-[#e8d5bc]/60 px-5 py-6 space-y-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={`block py-3 text-sm font-semibold uppercase tracking-widest border-b border-[#e8d5bc]/40 transition-colors ${
                pathname === href ? "text-[#7b5800]" : "text-[#271908]"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/menu"
            onClick={closeMenu}
            className="block mt-4 bg-[#7b5800] text-white text-center py-4 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            Order Now
          </Link>
        </div>
      )}
    </nav>
  );
}
