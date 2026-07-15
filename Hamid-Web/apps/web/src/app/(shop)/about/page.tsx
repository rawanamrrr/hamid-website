import Image from "next/image";

const values = [
  { icon: "eco", title: "Ethical Sourcing", desc: "We partner directly with farmers who share our values of sustainability and fair trade." },
  { icon: "local_cafe", title: "Artisan Roasting", desc: "Small-batch roasting in Cairo preserves the nuance of every origin we source." },
  { icon: "history_edu", title: "Heritage First", desc: "Every product design and brewing method honors centuries of Egyptian coffee culture." },
  { icon: "groups", title: "Community", desc: "Our branches are gathering places — spaces for conversation, culture, and connection." },
];

const team = [
  { name: "Hamid Afandi", role: "Founder & Head Roaster", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ZwdGmO_DCQ_aCgiwaPolMXaHgusfYkpwIs7fHmlbBxDfA6uuhnwAMYvMubrVmYYXtY0gXBmKNtiriXbDLwAFGweLRTltgsgUQ_W4UHNYn9_UjkKloMXnaDEUEk5aHm45KZ25PZ0jGkBnfJ9oM4eHULDOG4t1GGs0cCy1fQvE3IthcWYIUCvYtVosgW38GkHhLWE_T2pwYSB94qI5qcwlSihBA1L485ERxJlFeZlQ5DwFB30bWFM5EPJpwaBJ93xT1czcPstot8Uq" },
  { name: "Dina Mansour", role: "Head of Operations", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEkkUYsBilZcRFKb99oIS5EiJRGznTw3K4rgIlYROhOvnlPUq4t12Ig32XJ3eXuk-vyQtZtz_NOTSVw-B7_OSNI5AqHs8kYVB98Ab0GYBm6PB18hN61mLajZ4k5rD7c_vwLUHp2_h07oSAlFG72QitHhHvVNBQ8Lx8cJNTrdfNXvsya2decTr31B_vtA8KSgLdJsnK1fdno3J86SKmzXAfEl9nENMcN-voi1OkLV5EPRwZDArMMaBOaqa8zai3fdcgl_cIKLTq8AVn" },
  { name: "Karim Adel", role: "Master Barista", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrEVFYM1L6FTqLYhtPRdwvLDFbDlk2ogIvmI8qFS5Au0K9deWoqdWQx0sQ54mAr3ovbV4L5RPWuTU6EnqStwp22LQVePhkSAeID5IZ3VKNjUIF76FCtlKGvuGNsy5Hm5tYtUOgAwriUbwm_6YgL4a70yyHow2kYqLXlaHNjrZJV6y4tH-l3W1mRiRYeczRwrmBCi8xnP8omOTmyaJGY14344_N7my9EOMQmjEodC4vRqNk-Y176LOOb_yaHfuo6d33HW5ajO6Iw9Uu" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkH61wZIeWDQVG7XwTYY-UgMR2izAozhpZN5O6mWPcOyaus5yRNk_4n4oibOL05Z6PrWnyq76Jyy5DN9vmYgILrOgkzm4Oy6FC5dw0xb0xW4srS8s4ZEY0_T6tGzyD5JRX6LfFNSUN3PK8-cDZEYEsfbXz3eK4r7CtXVCbbkzsTPCN-Wfxd-atfgg_0HdgsC5ePQxQ_jLN7ql_uko3b4gM2z1UkjdrnsC4QwCnNZVmQGX_y9Xy9DUhIB9X7Mkg6Tz7G9v1tSlk37s6')" }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center text-white space-y-4 px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5800]">Since 1952</span>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-5xl font-bold">Our Story</h1>
          <p className="text-[#D9C1AA] text-lg max-w-xl mx-auto">
            From a single coffee cart in downtown Cairo to a beloved heritage brand.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-16 max-w-[1280px] mx-auto">
        <div className="max-w-3xl mx-auto space-y-6 text-[#4f4541] text-lg leading-relaxed text-center">
          <p>
            Hamid Afandi Coffee was born from a grandfather&apos;s passion. In 1952, Hamid Afandi began roasting beans in a small cart near Al-Hussein Mosque in Islamic Cairo, serving the neighborhood&apos;s merchants, artists, and intellectuals.
          </p>
          <p>
            His secret was simple: source only the best, roast with patience, and serve with pride. Three generations later, we carry that same philosophy into every bag we produce and every branch we open.
          </p>
          <p>
            We source our beans directly from farmers in Ethiopia, Brazil, Colombia, and Yemen — building relationships that last decades. Each harvest is cupped, graded, and roasted in our Cairo facility before reaching your cup.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#ffead8]">
        <div className="px-16 max-w-[1280px] mx-auto">
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] font-semibold text-black mb-12 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#7b5800] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
                </div>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-semibold text-black">{title}</h3>
                <p className="text-[#4f4541] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-16 max-w-[1280px] mx-auto">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] font-semibold text-black mb-12 text-center">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto">
          {team.map(({ name, role, image }) => (
            <div key={name} className="text-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#7b5800] mx-auto relative">
                <Image src={image} alt={name} fill className="object-cover" unoptimized />
              </div>
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-semibold text-black">{name}</h3>
              <p className="text-[#7b5800] text-sm font-semibold uppercase tracking-widest">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
