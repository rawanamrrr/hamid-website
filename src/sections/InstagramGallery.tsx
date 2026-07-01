import Image from "next/image";

const photos = [
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-mC26bB2x66nsnPViuVeNaB6IzJi0vUPNLCZhx6E1W8WrRky2jm8WW_CLp9MfJE5VXnq8pZna0plcHgeQRGQx1OZRqLliJmkEJMFuZbYT8_48gS87ZXDqUNjInaZ5muf5veLkac3Q78uafAD9yAYLIte1T3Pk8a08kuDChkMvuW6nh7FMObHznsnRUSkPCgKBdZWQ8X1PPEzvjEDLLe04w6j4k0aCDUA9VqolFvfg5nfzM_liwhnhBeZ-rB3xMCj_AAri5Xh-Mfca", alt: "Latte art pour" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGDm2Espjkau2eZBUoPSyhwhnu5PClVqC6GcTsZz--ZpkWD7AaDOrfMzradikpV6CS7IhOIRnrFll_0NWnJLxwiTeZaNPZ3akrjbKMvz7Yvw0wadaya3HWemdtfZh_uJong7cx85qh6Xzjt5EvLx-Ef1o6OD6R42W4zOqL8oburJD-WiNYxpRysHSec392zNgnO0bMh9D58IcDD8NwHcUX7_4Pk0emwv1LWGi5M3qgzmGlYi7OZ8oV-fsf3YAePOV9_kZh49xezhOj", alt: "Egyptian breakfast spread" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjH39DFRbhHp5O_oXN8twAV6J2Etj923ufUIyyAWvU6VzhsTgVZh8R01mu8BP2QXHtABshvLF9eAr5YSKHK829voUsbeTpiIWxDOC-JEvyoE5FbAnGNZYP3xuLNveiE9fiXCb3in0JtjxFtBRyZbdvLMooXj-8raCyHsDYoBe-ZADDgyXVjHCmCfqjXH7E9rGHxRGTEZ3alId1XeB1flfG-qeBWU7Uqi7fBS2niO8YtzJs_Tb1wYKfUYmRklA2apGsnk2TgreRvxfC", alt: "Coffee roasting logbook" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-8QEfNfLQXHok6C-2tosGWXorttjKPcNSsUkF-sq231VQHkX1mWNHVEawhKGnqSguepMcfxOsc5XtY1cwamwk2e4Qnyl0zkGBojYc57st6CkBiwValZqvP6vh_C-XfrsBKeT1xPZ9d9Vhy5ppcKMBB51WZw1-StGh-FnKW35HN6gXtMNlHInXhvX95lUaS_RBj8AFX5jVepaBy3JW6m1UmB00fk1eTgb1aQ5Vvk7mhc63Tvt5Ug0xNFE48j2JnnvC9deDYQKC0jO", alt: "Friends sharing coffee" },
];

export default function InstagramGallery() {
  return (
    <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto">
      <div className="text-center mb-8 md:mb-12 space-y-1">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black">
          From Our Instagram
        </h2>
        <p className="text-[#7b5800] text-sm font-semibold">Follow Us @hamidafandi.coffee</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {photos.map(({ src, alt }) => (
          <div key={alt} className="aspect-square overflow-hidden rounded-2xl group relative cursor-pointer bg-[#f2d5ba]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
