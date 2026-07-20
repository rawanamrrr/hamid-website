"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

const EXPERIENCE_HREFS = ["/sourcing", "/brewing-guides", "/wholesale", "/careers"];
const CARE_HREFS = ["/contact", "/shipping-returns", "/branches", "/faq"];

function AccordionSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 md:border-none">
      <button
        className="w-full flex justify-between items-center py-4 md:py-0 md:cursor-default"
        onClick={() => setOpen(!open)}
      >
        <h4 className="text-xs font-semibold uppercase tracking-widest text-[#7b5800]">{title}</h4>
        <span className="material-symbols-outlined text-[#7b5800] text-lg md:hidden" aria-hidden="true">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      <ul className={`space-y-3 overflow-hidden transition-all duration-300 ${open ? "max-h-60 pb-4" : "max-h-0 md:max-h-none"} md:max-h-none md:pb-0 md:mt-6`}>
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link href={href} className="text-[#D9C1AA] hover:text-[#7b5800] transition-all text-sm md:text-base block py-0.5">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ dict }: { dict: Dictionary }) {
  const sections = [
    { title: dict.footer.experienceTitle, links: dict.footer.experienceLinks.map((label, i) => ({ label, href: EXPERIENCE_HREFS[i] })) },
    { title: dict.footer.careTitle, links: dict.footer.careLinks.map((label, i) => ({ label, href: CARE_HREFS[i] })) },
  ];

  return (
    <footer className="bg-[#0D0705] border-t border-white/5">
      <div className="px-5 md:px-16 py-12 md:py-20 max-w-[1280px] mx-auto text-white">
        {/* Logo + tagline + socials */}
        <div className="mb-8 md:mb-0 md:contents">
          <div className="flex flex-col gap-5 md:contents">
            <div className="md:hidden space-y-4">
              <Link href="/">
                <Image
                  src="/hamid-logo.png"
                  alt="Hamid Afandi"
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain brightness-[0.85] sepia saturate-[3] hue-rotate-[5deg]"
                />
              </Link>
              <p className="text-[#D9C1AA] text-sm opacity-80 max-w-xs">{dict.footer.tagline}</p>
              <div className="flex gap-3">
                <a href="https://instagram.com/hamidafandi.coffee" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#7b5800] hover:text-[#7b5800] transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="https://facebook.com/hamidafandi.coffee" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#7b5800] hover:text-[#7b5800] transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          <div className="space-y-6">
            <Link href="/">
              <Image src="/hamid-logo.png" alt="Hamid Afandi" width={72} height={72} className="h-18 w-18 object-contain brightness-[0.85] sepia saturate-[3] hue-rotate-[5deg]" />
            </Link>
            <p className="text-[#D9C1AA] text-base opacity-80">{dict.footer.tagline}</p>
            <div className="flex gap-4">
              {[
                <path key="ig" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
                <path key="fb" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
              ].map((d, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#7b5800] hover:text-[#7b5800] transition-all opacity-80 hover:opacity-100">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">{d}</svg>
                </a>
              ))}
            </div>
          </div>
          {sections.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#7b5800] mb-6">{title}</h4>
              <ul className="space-y-4">
                {links.map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-[#D9C1AA] hover:text-[#7b5800] transition-all text-base">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#7b5800] mb-6">{dict.footer.ourBranch}</h4>
            <p className="text-[#D9C1AA] text-base opacity-80 mb-4">{dict.footer.branchHint}</p>
            <p className="text-white font-bold">{dict.footer.openDaily}</p>
          </div>
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden border-t border-white/10 mt-2">
          {sections.map(({ title, links }) => (
            <AccordionSection key={title} title={title} links={links} />
          ))}
          <div className="border-b border-white/10 py-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#7b5800] mb-2">{dict.footer.ourBranch}</h4>
            <p className="text-[#D9C1AA] text-sm opacity-80">{dict.footer.branchHint}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center px-5">
        <p className="text-[#D9C1AA] text-xs opacity-80">
          © {new Date().getFullYear()} Hamid Afandi Coffee. {dict.footer.rights}
          <span className="mx-2">|</span>
          <Link href="/privacy" className="hover:text-[#7b5800]">{dict.footer.privacyPolicy}</Link>
        </p>
      </div>
    </footer>
  );
}
