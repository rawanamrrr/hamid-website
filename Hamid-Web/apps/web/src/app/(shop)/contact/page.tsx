import type { Metadata } from "next";
import { SimplePageHero } from "@/components/SimplePageHero";

export const metadata: Metadata = {
  title: "Contact Us | Hamid Afandi",
  description: "Get in touch with Hamid Afandi Coffee.",
};

const CHANNELS = [
  { icon: "mail", label: "Email", value: "hello@hamidafandi.coffee", href: "mailto:hello@hamidafandi.coffee" },
  { icon: "call", label: "Phone", value: "+20 100 123 4567", href: "tel:+201001234567" },
  { icon: "location_on", label: "Flagship Branch", value: "Taksem Khattab, Mansoura, Egypt", href: "/branches" },
];

export default function ContactPage() {
  return (
    <div>
      <SimplePageHero eyebrow="Get in touch" title="Contact Us" subtitle="We'd love to hear from you — questions, feedback, or wholesale inquiries." />
      <section className="py-16 px-5 md:px-16 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CHANNELS.map(({ icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center text-center gap-3 rounded-2xl border border-[#e8d5bc]/60 p-6 hover:border-[#7b5800] transition-colors"
            >
              <span className="material-symbols-outlined text-2xl text-[#7b5800]" aria-hidden="true">{icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#817570]">{label}</p>
                <p className="mt-1 text-sm font-medium text-[#271908]">{value}</p>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-[#4f4541]">
          For wholesale partnerships, see our <a href="/wholesale" className="text-[#7b5800] underline">Wholesale page</a>. We
          typically respond within 1-2 business days.
        </p>
      </section>
    </div>
  );
}
