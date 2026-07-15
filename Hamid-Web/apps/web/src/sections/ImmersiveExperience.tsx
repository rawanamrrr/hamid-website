import Image from "next/image";
import { getDict } from "@/lib/i18n";

export default async function ImmersiveExperience() {
  const dict = await getDict();
  const stats = [
    { icon: "eco", label: dict.home.immersive.stat1Label, sub: dict.home.immersive.stat1Sub },
    { icon: "local_fire_department", label: dict.home.immersive.stat2Label, sub: dict.home.immersive.stat2Sub },
    { icon: "history_edu", label: dict.home.immersive.stat3Label, sub: dict.home.immersive.stat3Sub },
  ];
  return (
    <section className="relative min-h-[560px] md:h-[819px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQwUW2-Nl99Fd61IHy372RbhsPzdro6dQMmnL8hfvAx3NN86mzWCtw9WNxR_o8IHRBJzTeFboF-QdCcaIDrE-e2UM-lSzKq8ohYF6NaTS72PeZX2mU4d5zt0bsmkwW00cV31Y_A06xscg83zg9MNZnHp7pTUvthrI0qiQXqATOXeIUHzjPL3qMrCFzqejlmZ1qjFUoPlZGIgHSu05uIeKZg1wO17r6s3eVRn7QwgVa8dRyE_CFHaggMcLredAc_hms4P6b2rxUB9h1"
          alt="Master roaster at work"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-[#0D0705]/60" />
      </div>
      <div className="relative z-10 text-center max-w-4xl px-6 md:px-5 py-16 md:py-0">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-5xl font-bold text-white mb-5 md:mb-8">
          {dict.home.immersive.title}
        </h2>
        <p className="text-sm md:text-lg text-[#D9C1AA] mb-10 md:mb-10 leading-relaxed max-w-xl mx-auto">
          {dict.home.immersive.subtitle}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-white">
          {stats.map(({ icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-3 bg-white/5 rounded-2xl p-6 md:p-0 md:bg-transparent md:rounded-none md:block md:space-y-2">
              <span className="material-symbols-outlined text-[#7b5800] text-3xl md:text-2xl">{icon}</span>
              <span className="font-[family-name:var(--font-plus-jakarta)] text-lg md:text-2xl font-bold text-[#ffdea6] md:text-[#7b5800] block">
                {label}
              </span>
              <p className="text-xs text-[#D9C1AA] md:opacity-70 leading-relaxed">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
