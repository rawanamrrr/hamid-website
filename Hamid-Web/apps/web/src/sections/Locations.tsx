import { getDict } from "@/lib/i18n";

export default async function Locations() {
  const dict = await getDict();
  const branches = [{ name: dict.home.locations.branchName, address: "Taksem Khattab, Mansoura", active: true }];
  return (
    <section className="py-12 md:py-20 bg-[#ffe4c9] overflow-hidden">
      <div className="px-5 md:px-16 max-w-[1280px] mx-auto">

        {/* Mobile layout */}
        <div className="md:hidden space-y-5">
          <div className="space-y-1">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-semibold text-black">
              {dict.home.locations.title}
            </h2>
            <p className="text-[#4f4541] text-sm">{dict.home.locations.subtitle}</p>
          </div>

          {/* Map first on mobile */}
          <div className="w-full h-52 rounded-3xl overflow-hidden luxury-shadow">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_Ki8fEXHLMzEoRtk5goIjM_EVOkVtEP0qBbxKbSTsgMapp-SXp2jIsZ2-TOJb0kCXVhb2sjKl1OSz5eqJ9bkC5mB0GshPuGOhSc4ddSK-weJEbjEicmY5gGfI8RwWorDG5jP68GctDQWWC-irILJPQqZBqFyS2pt6kwCcbKJ-oSbO-LR7NICpjoXUZmVdmxBbBFQm_psK5swjehJriSQHqHE2XOAsehHEegHlQ52AIw0YVcZilmCS6Mnaz1Wd0J7b3XgJNihHJ0_i')",
              }}
            />
          </div>

          {/* Info card */}
          <div className="bg-white rounded-3xl luxury-shadow p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fff1e6] flex items-center justify-center flex-shrink-0">
                <span aria-hidden="true" className="material-symbols-outlined text-[#7b5800] text-xl">location_on</span>
              </div>
              <div>
                <h4 className="font-bold text-black text-base">{dict.home.locations.branchName}</h4>
                <p className="text-sm text-[#4f4541]">Taksem Khattab, Mansoura</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#4f4541]">
              <span aria-hidden="true" className="material-symbols-outlined text-[#7b5800] text-base">schedule</span>
              {dict.home.locations.openDailyHours}
            </div>
            <a
              href="https://maps.google.com/?q=Taksem+Khattab+Mansoura"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-11 bg-[#7b5800] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#5c3d1e] transition-all"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">directions</span>
              {dict.home.locations.getDirections}
            </a>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex flex-row gap-6 items-center">
          <div className="w-1/3 space-y-10">
            <div className="space-y-3">
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] font-semibold text-black">
                {dict.home.locations.title}
              </h2>
              <p className="text-[#4f4541] text-base">{dict.home.locations.subtitle}</p>
            </div>
            <div className="space-y-4">
              {branches.map(({ name, address, active }) => (
                <div
                  key={name}
                  className={`p-6 rounded-2xl luxury-shadow flex items-start gap-4 ${active ? "bg-white" : "bg-white/50 border border-[#817570]/10"}`}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[#7b5800]">location_on</span>
                  <div>
                    <h4 className="font-bold text-black">{name}</h4>
                    <p className="text-sm text-[#4f4541]">{address}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://maps.google.com/?q=Taksem+Khattab+Mansoura"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 border-2 border-[#7b5800] text-[#7b5800] rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#7b5800] hover:text-white transition-all"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">directions</span>
              {dict.home.locations.getDirections}
            </a>
          </div>

          <div className="w-2/3 h-[500px] rounded-3xl overflow-hidden luxury-shadow">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_Ki8fEXHLMzEoRtk5goIjM_EVOkVtEP0qBbxKbSTsgMapp-SXp2jIsZ2-TOJb0kCXVhb2sjKl1OSz5eqJ9bkC5mB0GshPuGOhSc4ddSK-weJEbjEicmY5gGfI8RwWorDG5jP68GctDQWWC-irILJPQqZBqFyS2pt6kwCcbKJ-oSbO-LR7NICpjoXUZmVdmxBbBFQm_psK5swjehJriSQHqHE2XOAsehHEegHlQ52AIw0YVcZilmCS6Mnaz1Wd0J7b3XgJNihHJ0_i')",
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
