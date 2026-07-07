import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center">
        {/* Image always first on mobile */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative z-10 w-full h-64 md:h-[500px] rounded-3xl overflow-hidden luxury-shadow">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkH61wZIeWDQVG7XwTYY-UgMR2izAozhpZN5O6mWPcOyaus5yRNk_4n4oibOL05Z6PrWnyq76Jyy5DN9vmYgILrOgkzm4Oy6FC5dw0xb0xW4srS8s4ZEY0_T6tGzyD5JRX6LfFNSUN3PK8-cDZEYEsfbXz3eK4r7CtXVCbbkzsTPCN-Wfxd-atfgg_0HdgsC5ePQxQ_jLN7ql_uko3b4gM2z1UkjdrnsC4QwCnNZVmQGX_y9Xy9DUhIB9X7Mkg6Tz7G9v1tSlk37s6"
              alt="Historic Cairo coffee house"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              unoptimized
            />
          </div>
          {/* Corner accents — desktop only */}
          <div className="hidden md:block absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-[#7b5800]/30" />
          <div className="hidden md:block absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-[#7b5800]/30" />
        </div>

        <div className="w-full md:w-1/2 space-y-5 md:space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5800]">Our Legacy</span>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-5xl font-bold text-black leading-tight">
              Heritage in Every Single Detail
            </h2>
          </div>
          <p className="text-sm md:text-lg text-[#4f4541] leading-relaxed">
            From the vibrant heart of Cairo, Hamid Afandi brings the timeless coffee tradition to life with passion, craftsmanship, and authenticity. Our story began with a simple vision: to honor the complex rituals of Egyptian brewing while embracing the refinements of modern roasting.
          </p>
          <p className="text-sm md:text-base text-[#4f4541] leading-relaxed">
            We source only the finest beans from ethical farmers across the coffee belt, ensuring every bag tells a story of origin, resilience, and unparalleled flavor.
          </p>
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 text-black text-xs font-semibold uppercase tracking-widest border-b-2 border-black pb-2 hover:text-[#7b5800] hover:border-[#7b5800] transition-all"
          >
            Discover Our Story
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
              arrow_right_alt
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
