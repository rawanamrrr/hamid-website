import Link from "next/link";
import { getDict } from "@/lib/i18n";

export default async function Categories() {
  const dict = await getDict();
  return (
    <section className="py-12 md:py-20 bg-[#ffead8]">
      <div className="px-5 md:px-16 max-w-[1280px] mx-auto">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black mb-8 md:mb-12 text-center">
          {dict.home.categories.title}
        </h2>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-4 md:hidden">
          <div className="group relative overflow-hidden rounded-3xl luxury-shadow bg-[#0D0705] h-52">
            <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnLyE0AV2PpaHpAIsGnofk40-Valox_QyotcE-o57h6ajtSIqenIHsx0B9mLuf5h8GSKz0DoP_1Cb8NHBGPZGoedrVnqSrEGgVC9aonl9OK5ZyHsTEo22s1bdOoDoa8KPurZHAGWzfojggBSSYP7kB6WYZyZ6vbMs8xZ--X6z8yBATLGnBbW_2iK2haSA9K_sCVuh2eNYXEwe6PRomI0XG1Ezt_nzKujIr-RSQlY2QbCbSutEejj1KLrjcAp_q0fSfty_mfqO8Exm-')" }} />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold mb-1">{dict.home.categories.coffeeBeansTitle}</h3>
              <p className="text-sm opacity-80 mb-3">{dict.home.categories.coffeeBeansDesc}</p>
              <Link href="/coffee" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-[#ffdea6]">
                {dict.home.categories.explore} <span aria-hidden="true" className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group relative overflow-hidden rounded-3xl luxury-shadow bg-black h-40">
              <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtHJO0P8lnQRgLkZnHiguKhs_L21LPF-xDZvzmr2trJ7KmpFR_hwwIf1zcxrNys4ORwC0tdjlJR4T7U_7d6Appl-R2awVjPZxpR81qcuTx8HhgMdz7tio5QUxPSMycuQ6HxZkVwBiu5jp8H9sTR6edkTYOTlujLoop-J4WUshVgHSjETPfi9TB8ffq3_VG-JCyYcR2SvJB1KSlIvqRar7kagI0IWN1-oruYe-iwd7kdM4LKVEdcKa4QfLCasHCj_IYgYoaATeIJtxq')" }} />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-bold">{dict.home.categories.turkishCoffee}</h3>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl luxury-shadow bg-[#7b5800] h-40">
              <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEsHAR7ODVNAYkY6yPqfb-mAh84mmOmZpi4nwE7VIK-bpflOMRsneh4VbqJo-ZkzeDu-s74yuFnTw0lYtePbpgOSNkjXMlQtEL473pdpfPoeXwyzv9g38iHy1Dyab5GYzbQCFKbT205kDWQNi6JSc44tMEcTN25nPQAfNeFUW_zNcIa2NKlwW8OCJiLEQeZCYnmEK3qk_jg83FJKQz2-8eEhNKF-grCgxpz5TSZjrU6uVvw0Cv3qnls-IKZNK5Wn-1cz5cmU_8JVkg')" }} />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-semibold">{dict.home.categories.espresso}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: bento grid */}
        <div className="hidden md:grid grid-cols-6 grid-rows-2 gap-6 h-[600px]">
          <div className="col-span-3 row-span-2 group relative overflow-hidden rounded-[1.75rem] luxury-shadow bg-[#0D0705]">
            <div className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnLyE0AV2PpaHpAIsGnofk40-Valox_QyotcE-o57h6ajtSIqenIHsx0B9mLuf5h8GSKz0DoP_1Cb8NHBGPZGoedrVnqSrEGgVC9aonl9OK5ZyHsTEo22s1bdOoDoa8KPurZHAGWzfojggBSSYP7kB6WYZyZ6vbMs8xZ--X6z8yBATLGnBbW_2iK2haSA9K_sCVuh2eNYXEwe6PRomI0XG1Ezt_nzKujIr-RSQlY2QbCbSutEejj1KLrjcAp_q0fSfty_mfqO8Exm-')" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold mb-2">{dict.home.categories.coffeeBeansTitle}</h3>
              <p className="opacity-80 mb-6">{dict.home.categories.coffeeBeansDescLong}</p>
              <Link href="/coffee" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#ffdea6]">
                {dict.home.categories.exploreCollection} <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="col-span-3 row-span-1 group relative overflow-hidden rounded-[1.75rem] luxury-shadow bg-black">
            <div className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtHJO0P8lnQRgLkZnHiguKhs_L21LPF-xDZvzmr2trJ7KmpFR_hwwIf1zcxrNys4ORwC0tdjlJR4T7U_7d6Appl-R2awVjPZxpR81qcuTx8HhgMdz7tio5QUxPSMycuQ6HxZkVwBiu5jp8H9sTR6edkTYOTlujLoop-J4WUshVgHSjETPfi9TB8ffq3_VG-JCyYcR2SvJB1KSlIvqRar7kagI0IWN1-oruYe-iwd7kdM4LKVEdcKa4QfLCasHCj_IYgYoaATeIJtxq')" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold mb-1">{dict.home.categories.turkishCoffee}</h3>
              <Link href="/store" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#ffdea6]">
                {dict.home.categories.viewMore} <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="col-span-3 row-span-1 group relative overflow-hidden rounded-[1.75rem] luxury-shadow bg-[#7b5800]">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEsHAR7ODVNAYkY6yPqfb-mAh84mmOmZpi4nwE7VIK-bpflOMRsneh4VbqJo-ZkzeDu-s74yuFnTw0lYtePbpgOSNkjXMlQtEL473pdpfPoeXwyzv9g38iHy1Dyab5GYzbQCFKbT205kDWQNi6JSc44tMEcTN25nPQAfNeFUW_zNcIa2NKlwW8OCJiLEQeZCYnmEK3qk_jg83FJKQz2-8eEhNKF-grCgxpz5TSZjrU6uVvw0Cv3qnls-IKZNK5Wn-1cz5cmU_8JVkg')" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-semibold mb-1">{dict.home.categories.espresso}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
