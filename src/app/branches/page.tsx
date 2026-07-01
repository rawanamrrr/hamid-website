const highlights = [
  { icon: "local_cafe", title: "Specialty Coffee", desc: "Full menu of Egyptian heritage blends, Turkish coffee, and espresso drinks." },
  { icon: "storefront", title: "Dine In & Takeaway", desc: "A warm, thoughtfully designed space perfect for staying in or grabbing on the go." },
  { icon: "wifi", title: "Free Wi-Fi", desc: "Work, study, or simply relax in our comfortable seating areas." },
  { icon: "shopping_bag", title: "Retail Corner", desc: "Take home your favourite beans, grinders, and gift sets." },
];

export default function BranchesPage() {
  return (
    <div>
      {/* Hero banner */}
      <section
        className="relative h-[420px] flex items-end overflow-hidden"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQwUW2-Nl99Fd61IHy372RbhsPzdro6dQMmnL8hfvAx3NN86mzWCtw9WNxR_o8IHRBJzTeFboF-QdCcaIDrE-e2UM-lSzKq8ohYF6NaTS72PeZX2mU4d5zt0bsmkwW00cV31Y_A06xscg83zg9MNZnHp7pTUvthrI0qiQXqATOXeIUHzjPL3qMrCFzqejlmZ1qjFUoPlZGIgHSu05uIeKZg1wO17r6s3eVRn7QwgVa8dRyE_CFHaggMcLredAc_hms4P6b2rxUB9h1')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 px-8 md:px-16 pb-12 max-w-[1280px] mx-auto w-full">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fdca68] mb-3 block">Our Location</span>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-4xl md:text-6xl font-bold text-white leading-tight">
            Mansoura Branch
          </h1>
        </div>
      </section>

      {/* Address card — overlaps hero */}
      <div className="px-8 md:px-16 max-w-[1280px] mx-auto">
        <div
          className="relative -mt-8 z-10 rounded-3xl p-8 md:p-10 luxury-shadow flex flex-col md:flex-row md:items-center gap-8 md:gap-16"
          style={{ background: "#fff8f4" }}
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-[#7b5800] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-xl">location_on</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7b5800] mb-1">Address</p>
              <p className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold text-black">Taksem Khattab, Mansoura</p>
            </div>
          </div>

          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-[#7b5800] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-xl">schedule</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7b5800] mb-1">Hours</p>
              <p className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold text-black">Open Daily</p>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Taksem+Khattab+Mansoura"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-[#7b5800] text-white px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#765400] transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">directions</span>
            Get Directions
          </a>
        </div>
      </div>

      {/* What we offer */}
      <section className="py-20 px-8 md:px-16 max-w-[1280px] mx-auto">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] font-semibold text-black mb-12 text-center">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#fff1e6] rounded-2xl p-8 text-center space-y-4 luxury-shadow hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-[#7b5800] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
              </div>
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold text-black">{title}</h3>
              <p className="text-[#4f4541] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ambiance strip */}
      <section className="bg-[#0D0705] py-20 px-8 md:px-16">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fdca68]">The Experience</span>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-bold text-white leading-snug">
              Cairo&apos;s Heritage, Right Here in Mansoura
            </h2>
            <p className="text-[#D9C1AA] leading-relaxed">
              Step inside and feel the warmth of Egyptian coffee culture. Our Mansoura branch is designed to be a home away from home — rich interiors, the scent of freshly roasted beans, and the sound of quiet conversation.
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
      <section className="py-20 px-8 md:px-16 max-w-[1280px] mx-auto text-center space-y-6">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-bold text-black">
          We&apos;d Love to See You
        </h2>
        <p className="text-[#4f4541] max-w-md mx-auto">
          Come experience the tradition in person. No reservation needed — just follow the scent of freshly roasted coffee.
        </p>
        <a
          href="https://maps.google.com/?q=Taksem+Khattab+Mansoura"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#7b5800] text-white px-10 py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#765400] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">map</span>
          Find Us on the Map
        </a>
      </section>
    </div>
  );
}
