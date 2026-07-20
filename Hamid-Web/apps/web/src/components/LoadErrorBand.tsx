import Link from "next/link";

/**
 * Friendly inline fallback for a page section whose data failed to load —
 * used instead of letting a transient DB failure 500 the route or strand the
 * user on an endless skeleton.
 */
export function LoadErrorBand({ message, retryLabel, href }: { message: string; retryLabel: string; href: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-20 text-center">
      <span aria-hidden="true" className="material-symbols-outlined text-4xl text-[#c8a97a]">wifi_off</span>
      <p className="text-sm leading-relaxed text-[#4f4541]">{message}</p>
      <Link
        href={href}
        className="rounded-full bg-[#271908] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#7b5800]"
      >
        {retryLabel}
      </Link>
    </div>
  );
}
