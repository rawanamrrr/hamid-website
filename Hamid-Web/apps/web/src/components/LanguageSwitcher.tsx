"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "@/lib/i18n/actions";
import type { Locale } from "@hamid/core";

/**
 * Compact "EN / AR" segmented toggle — both abbreviations are always shown
 * (not just the target language), with the current one styled active. This
 * intentionally always renders the two Latin abbreviations rather than each
 * language's native name (previously "English" / "العربية"), since that read
 * as inconsistent/dated next to a plain toggle.
 */
export function LanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(target: Locale) {
    if (target === locale || pending) return;
    startTransition(async () => {
      await setLocaleAction(target);
      router.refresh();
    });
  }

  const textClass = className ?? "text-xs font-semibold uppercase tracking-widest transition-colors";

  return (
    // dir="ltr" pins "EN / AR" in that fixed order regardless of the page's
    // reading direction — a language switcher whose own option order flips
    // depending on which language is active would be disorienting.
    <div className="flex items-center gap-1.5" dir="ltr">
      <button
        type="button"
        onClick={() => switchTo("en")}
        disabled={pending}
        aria-current={locale === "en"}
        aria-label="Switch to English"
        className={`${textClass} disabled:opacity-50 ${locale === "en" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
      >
        EN
      </button>
      <span aria-hidden="true" className="text-xs opacity-40">
        /
      </span>
      <button
        type="button"
        onClick={() => switchTo("ar")}
        disabled={pending}
        aria-current={locale === "ar"}
        aria-label="التبديل إلى العربية"
        className={`${textClass} disabled:opacity-50 ${locale === "ar" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
      >
        AR
      </button>
    </div>
  );
}
