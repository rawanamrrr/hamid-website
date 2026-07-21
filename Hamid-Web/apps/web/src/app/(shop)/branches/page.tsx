import type { Metadata } from "next";
import { withDbTimeout } from "@/lib/db-timeout";
import { getBranches, FALLBACK_BRANCH } from "@/lib/branches/queries";

export const metadata: Metadata = {
  title: "Our Branches | Hamid Afandi",
  description: "Visit Hamid Afandi Coffee — find our branches, opening hours, and directions.",
};

const highlights = [
  { icon: "local_cafe", title: "Specialty Coffee", desc: "Full store of Egyptian heritage blends, Turkish coffee, and espresso drinks." },
  { icon: "storefront", title: "Dine In & Takeaway", desc: "A warm, thoughtfully designed space perfect for staying in or grabbing on the go." },
  { icon: "wifi", title: "Free Wi-Fi", desc: "Work, study, or simply relax in our comfortable seating areas." },
  { icon: "shopping_bag", title: "Retail Corner", desc: "Take home your favourite beans, grinders, and gift sets." },
];

export default async function BranchesPage() {
  const rows = await withDbTimeout(getBranches()).catch(() => []);

  const list = rows.length > 0 ? rows : [FALLBACK_BRANCH];
  const single = list.length === 1;
  const primaryMapUrl = list[0]?.mapUrl ?? FALLBACK_BRANCH.mapUrl!;

  return (
    <div>
      {/* Hero banner */}
      <section
        className="relative h-[320px] md:h-[420px] flex items-end overflow-hidden"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQwUW2-Nl99Fd61IHy372RbhsPzdro6dQMmnL8hfvAx3NN86mzWCtw9WNxR_o8IHRBJzTeFboF-QdCcaIDrE-e2UM-lSzKq8ohYF6NaTS72PeZX2mU4d5zt0bsmkwW00cV31Y_A06xscg83zg9MNZnHp7pTUvthrI0qiQXqATOXeIUHzjPL3qMrCFzqejlmZ1qjFUoPlZGIgHSu05uIeKZg1wO17r6s3eVRn7QwgVa8dRyE_CFHaggMcLredAc_hms4P6b2rxUB9h1')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 px-5 md:px-16 pb-12 max-w-[1280px] mx-auto w-full">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fdca68] mb-3 block">
            {single ? "Our Location" : "Our Locations"}
          </span>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-6xl font-bold text-white leading-tight">
            {single ? list[0].name : "Find a Branch"}
          </h1>
        </div>
      </section>

      {/* Branch cards — overlap the hero */}
      <div className="px-5 md:px-16 max-w-[1280px] mx-auto">
        <div className={`relative -mt-8 z-10 grid gap-4 md:gap-6 ${single ? "" : "md:grid-cols-2"}`}>
          {list.map((b) =>
            single ? (
              <div key={b.id} className="rounded-3xl p-6 md:p-8 luxury-shadow" style={{ background: "#fff8f4" }}>
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#7b5800] flex items-center justify-center flex-shrink-0">
                      <span aria-hidden="true" className="material-symbols-outlined text-white text-xl">location_on</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#7b5800] mb-1">Address</p>
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-lg md:text-xl font-bold text-black">
                        {b.address ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#7b5800] flex items-center justify-center flex-shrink-0">
                      <span aria-hidden="true" className="material-symbols-outlined text-white text-xl">schedule</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#7b5800] mb-1">Hours</p>
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-lg md:text-xl font-bold text-black">
                        {b.hours ?? "Open Daily"}
                      </p>
                    </div>
                  </div>

                  {b.mapUrl && (
                    <a
                      href={b.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 bg-[#7b5800] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#765400] transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">directions</span>
                      Get Directions
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div
                key={b.id}
                className="flex flex-col rounded-3xl p-6 md:p-8 luxury-shadow"
                style={{ background: "#fff8f4" }}
              >
                <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold text-black mb-5">{b.name}</h2>

                <div className="flex-1 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#7b5800] flex items-center justify-center flex-shrink-0">
                      <span aria-hidden="true" className="material-symbols-outlined text-white text-xl">location_on</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#7b5800] mb-1">Address</p>
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-base md:text-lg font-bold text-black leading-snug">
                        {b.address ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#7b5800] flex items-center justify-center flex-shrink-0">
                      <span aria-hidden="true" className="material-symbols-outlined text-white text-xl">schedule</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#7b5800] mb-1">Hours</p>
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-base md:text-lg font-bold text-black leading-snug">
                        {b.hours ?? "Open Daily"}
                      </p>
                    </div>
                  </div>
                </div>

                {b.mapUrl && (
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full bg-[#7b5800] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#765400] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">directions</span>
                    Get Directions
                  </a>
                )}
              </div>
            ),
          )}
        </div>
      </div>

      {/* What we offer */}
      <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black mb-8 md:mb-12 text-center">
          What We Offer
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {highlights.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#fff1e6] rounded-2xl p-5 md:p-8 text-center space-y-2.5 md:space-y-4 luxury-shadow hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#7b5800] flex items-center justify-center mx-auto">
                <span aria-hidden="true" className="material-symbols-outlined text-white text-xl md:text-2xl">{icon}</span>
              </div>
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base md:text-lg font-semibold text-black">{title}</h3>
              <p className="text-[#4f4541] text-xs md:text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ambiance strip */}
      <section className="bg-[#0D0705] py-12 md:py-20 px-5 md:px-16">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/2 space-y-4 md:space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fdca68]">The Experience</span>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-4xl font-bold text-white leading-snug">
              Cairo&apos;s Heritage, In Every Branch
            </h2>
            <p className="text-[#D9C1AA] leading-relaxed">
              Step inside and feel the warmth of Egyptian coffee culture. Every branch is designed to be a home away from
              home — rich interiors, the scent of freshly roasted beans, and the sound of quiet conversation.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {["Dine In", "Takeaway", "Free Wi-Fi", "Retail Corner"].map((tag) => (
                <span key={tag} className="bg-[#fdca68]/20 text-[#fdca68] border border-[#fdca68]/30 px-4 py-1.5 rounded-full text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div
            className="md:w-1/2 h-72 md:h-96 w-full rounded-3xl overflow-hidden"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtHJO0P8lnQRgLkZnHiguKhs_L21LPF-xDZvzmr2trJ7KmpFR_hwwIf1zcxrNys4ORwC0tdjlJR4T7U_7d6Appl-R2awVjPZxpR81qcuTx8HhgMdz7tio5QUxPSMycuQ6HxZkVwBiu5jp8H9sTR6edkTYOTlujLoop-J4WUshVgHSjETPfi9TB8ffq3_VG-JCyYcR2SvJB1KSlIvqRar7kagI0IWN1-oruYe-iwd7kdM4LKVEdcKa4QfLCasHCj_IYgYoaATeIJtxq')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto text-center space-y-4 md:space-y-6">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-3xl font-bold text-black">
          We&apos;d Love to See You
        </h2>
        <p className="text-[#4f4541] max-w-md mx-auto">
          Come experience the tradition in person. No reservation needed — just follow the scent of freshly roasted coffee.
        </p>
        <a
          href={primaryMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#7b5800] text-white px-10 py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#765400] transition-colors"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">map</span>
          Find Us on the Map
        </a>
      </section>
    </div>
  );
}
