"use client";

import { useEffect, useState } from "react";
import type { MenuHeroImageView } from "@/lib/menu/queries";

const HERO_SLIDE_INTERVAL_MS = 6000;

/** Intro banner background — crossfades through the admin-managed hero images. */
export function IntroHeroBackground({ images }: { images: MenuHeroImageView[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % images.length), HERO_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0">
      {images.map((img, i) => {
        const fadeClass = `absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
          i === active ? "opacity-100" : "opacity-0"
        }`;
        return (
          <div key={img.desktopUrl} aria-hidden={i !== active}>
            <div className={`${fadeClass} md:hidden`} style={{ backgroundImage: `url('${img.mobileUrl || img.desktopUrl}')` }} />
            <div className={`${fadeClass} hidden md:block`} style={{ backgroundImage: `url('${img.desktopUrl}')` }} />
          </div>
        );
      })}
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}
