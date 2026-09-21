"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { LocalizedBranch } from "@/lib/branches/queries";
import { SocialIconLinks } from "@/components/social-links";

const EXPERIENCE_HREFS = ["/sourcing", "/brewing-guides", "/wholesale", "/careers"];
const CARE_HREFS = ["/contact", "/shipping-returns", "/branches", "/faq"];

// Tiled coffee-bean pattern (two beans at different angles per 120px tile).
const BEAN_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>` +
    `<g fill='none' stroke='#FFE2C6' stroke-width='1.6'>` +
    `<g transform='translate(30 34) rotate(-30)'><ellipse rx='11' ry='16'/><path d='M0 -15 C6 -5 -6 5 0 15'/></g>` +
    `<g transform='translate(88 88) rotate(35)'><ellipse rx='9' ry='13'/><path d='M0 -12 C5 -4 -5 4 0 12'/></g>` +
    `</g></svg>`,
)}")`;

function AccordionSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#FFE2C6]/15">
      <button className="w-full flex justify-between items-center py-4" onClick={() => setOpen(!open)}>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FFE2C6]">{title}</h4>
        <span className="material-symbols-outlined text-[#FFE2C6] text-lg" aria-hidden="true">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      <ul className={`space-y-3 overflow-hidden transition-all duration-300 ${open ? "max-h-60 pb-4" : "max-h-0"}`}>
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link href={href} className="text-[#EEE5D4]/75 hover:text-[#FFE2C6] transition-colors text-sm block py-0.5">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Logo({ size }: { size: number }) {
  return (
    <Link href="/" className="inline-block">
      {/* Official Arabic wordmark, tinted cream — its original dark brown
          would disappear against the footer's dark background. */}
      <Image
        src="/brand/wordmark-ar-cropped.svg"
        alt="حميد أفندي"
        width={Math.round(size * (583 / 245))}
        height={size}
        className="object-contain"
        style={{ height: size, width: "auto", filter: "brightness(0) invert(93%) sepia(18%) saturate(300%)" }}
      />
    </Link>
  );
}

export default function Footer({ dict, branches = [] }: { dict: Dictionary; branches?: LocalizedBranch[] }) {
  const sections = [
    { title: dict.footer.experienceTitle, links: dict.footer.experienceLinks.map((label, i) => ({ label, href: EXPERIENCE_HREFS[i] })) },
    { title: dict.footer.careTitle, links: dict.footer.careLinks.map((label, i) => ({ label, href: CARE_HREFS[i] })) },
  ];
  const branchTitle = branches.length > 1 ? dict.footer.ourBranches : dict.footer.ourBranch;

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#3A261E] to-[#1C120E] text-[#EEE5D4]">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: BEAN_PATTERN }} />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#FFE2C6]/60 to-transparent" />

      <div className="relative px-5 md:px-16 pt-14 pb-10 md:pt-20 md:pb-14 max-w-[1280px] mx-auto">
        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <Logo size={56} />
            <p className="text-[#EEE5D4]/75 text-sm max-w-xs leading-relaxed">{dict.footer.tagline}</p>
            <SocialIconLinks className="flex gap-3" linkClassName="border-[#FFE2C6]/30 text-[#FFE2C6] hover:bg-[#FFE2C6] hover:text-[#3A261E]" />
          </div>
          <div className="border-t border-[#FFE2C6]/15">
            {sections.map(({ title, links }) => (
              <AccordionSection key={title} title={title} links={links} />
            ))}
            <div className="py-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FFE2C6] mb-3">{branchTitle}</h4>
              {branches.length > 0 ? (
                <ul className="space-y-2">
                  {branches.slice(0, 3).map((b) => (
                    <li key={b.id} className="text-[#EEE5D4]/75 text-sm">
                      <span className="font-semibold text-white">{b.name}</span>
                      {b.address && ` — ${b.address}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#EEE5D4]/75 text-sm">{dict.footer.branchHint}</p>
              )}
            </div>
          </div>
        </div>

        {/* Desktop — dir="ltr" keeps column order fixed between languages */}
        <div className="hidden md:grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10" dir="ltr">
          <div className="space-y-6">
            <Logo size={64} />
            <p className="text-[#EEE5D4]/75 leading-relaxed max-w-xs">{dict.footer.tagline}</p>
            <SocialIconLinks
              className="flex gap-3"
              iconClassName="w-5 h-5"
              linkClassName="border-[#FFE2C6]/30 text-[#FFE2C6] hover:bg-[#FFE2C6] hover:text-[#3A261E]"
            />
          </div>
          {sections.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FFE2C6] mb-6 pb-3 border-b border-[#FFE2C6]/20">{title}</h4>
              <ul className="space-y-3.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[#EEE5D4]/75 hover:text-[#FFE2C6] hover:ps-1 transition-all">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FFE2C6] mb-6 pb-3 border-b border-[#FFE2C6]/20">{branchTitle}</h4>
            {branches.length > 0 ? (
              <ul className="space-y-4">
                {branches.slice(0, 3).map((b) => (
                  <li key={b.id} className="flex gap-3">
                    <span aria-hidden="true" className="material-symbols-outlined text-[#FFE2C6] text-xl">location_on</span>
                    <div>
                      <p className="text-white font-semibold">{b.name}</p>
                      {b.address && <p className="text-[#EEE5D4]/70 text-sm">{b.address}</p>}
                      {b.hours && <p className="text-[#EEE5D4]/70 text-sm">{b.hours}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="text-[#EEE5D4]/75 mb-3">{dict.footer.branchHint}</p>
                <p className="text-white font-semibold">{dict.footer.openDaily}</p>
              </>
            )}
            {branches.length > 1 && (
              <Link href="/branches" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#FFE2C6] hover:underline">
                {dict.footer.viewAllBranches}
                <span aria-hidden="true" className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="relative border-t border-[#FFE2C6]/15 bg-black/20 py-5 px-5">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#EEE5D4]/65">
          <p>
            © {new Date().getFullYear()} Hamid Afandi Coffee. {dict.footer.rights}
            <span className="mx-2 opacity-50">•</span>
            <Link href="/privacy" className="hover:text-[#FFE2C6] transition-colors">{dict.footer.privacyPolicy}</Link>
          </p>
          <p>
            Made by{" "}
            <a
              href="https://www.digitivaa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#FFE2C6] hover:text-white transition-colors underline underline-offset-2"
            >
              Digitiva
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
