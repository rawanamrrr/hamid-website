"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function StoreSearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [value, setValue] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync the input when the URL changes externally (back/forward, category
  // links) — adjusted during render per React's "derived state" guidance.
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setValue(q);
  }

  function pushQuery(next: string) {
    const params = new URLSearchParams(searchParams);
    if (next.trim()) params.set("q", next.trim());
    else params.delete("q");
    router.push(`/store?${params.toString()}`);
  }

  function onChange(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushQuery(next), 400);
  }

  return (
    <div className="relative mx-auto mb-8 w-full max-w-md">
      <Search size={16} className="pointer-events-none absolute inset-y-0 start-4 my-auto text-[#817570]" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-[#e8d5bc]/60 bg-white py-2.5 ps-11 pe-11 text-sm text-[#271908] placeholder:text-[#817570] focus:border-[#7b5800] focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            pushQuery("");
          }}
          aria-label="Clear search"
          className="absolute inset-y-0 end-4 my-auto text-[#817570] hover:text-black"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
