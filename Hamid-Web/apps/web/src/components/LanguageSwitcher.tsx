"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "@/lib/i18n/actions";
import type { Locale } from "@hamid/core";

export function LanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: Locale = locale === "en" ? "ar" : "en";

  function toggle() {
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={next === "ar" ? "التبديل إلى العربية" : "Switch to English"}
      className={className ?? "text-xs font-semibold uppercase tracking-widest transition-colors disabled:opacity-50"}
    >
      {next === "ar" ? "العربية" : "English"}
    </button>
  );
}
