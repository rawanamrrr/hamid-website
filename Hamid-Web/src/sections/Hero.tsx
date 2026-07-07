import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] md:h-[921px] md:min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDpHYKaDbPH4GDNtKVPFXtZA_RQayLx4Q7gQKg0H16FobXpLQeOsPLnO_u-vIfevbrfB9xCRnrTZFV7qiE0DvxCvIT0Q5UnEcAFzGwlrrLx1o0INue903Sge4CRIO9Y14O4Dq1pWkVdFiy-96OgrmCI0NhfTNLSYZzpJEAm3VroFQszH7TgqQdh8gRKH0-iTxNNydoDmu9H7rvCQ5GH68F3kuErH43q_tLimva8ReDWnUnrtboLxylOnXzvpoG0OAXJK7FcM3qK1RCi')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 px-6 md:px-16 max-w-[1280px] mx-auto w-full py-20 md:py-0">
        <div className="max-w-2xl text-white space-y-6 md:space-y-8">
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[2.2rem] md:text-5xl font-bold tracking-tight leading-[1.15] md:leading-[1.1]">
            A Taste of Egyptian Heritage in Every Cup
          </h1>
          <p className="text-base md:text-lg text-[#D9C1AA] max-w-lg leading-relaxed">
            Premium coffee, deeply rooted in tradition, crafted for modern coffee lovers. Experience the rich soul of Cairo&apos;s coffee culture.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/store"
              className="flex items-center justify-center h-12 md:h-auto bg-[#7b5800] text-white px-8 md:px-10 md:py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#765400] transition-colors shadow-lg"
            >
              Shop Coffee
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-center h-12 md:h-auto border border-white text-white px-8 md:px-10 md:py-4 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
