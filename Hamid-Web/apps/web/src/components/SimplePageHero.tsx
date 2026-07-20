export function SimplePageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-[#0D0705] px-5 md:px-16 py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto text-center space-y-4">
        {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5800]">{eyebrow}</span>}
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-4xl md:text-5xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-[#D9C1AA] text-lg max-w-xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
}
