import type { Metadata, Viewport } from "next";
import { Inter, Arsenal, Anton, Cairo, El_Messiri } from "next/font/google";
import "./globals.css";
import { getLocale, dir } from "@/lib/i18n";
import { getSiteName } from "@/lib/settings/queries";
import { withDbTimeout } from "@/lib/db-timeout";

// Brand identity fonts (see Hamid Launch Kit PDF): the kit specifies Optima
// for headings and Lovelo for subheadings/labels. Neither is a free/Google
// font — Optima is Monotype-licensed and Lovelo is a paid Fontfabric release
// not distributed via Google Fonts — so until the actual licensed font files
// are supplied, Arsenal (closest free heading substitute for Optima's flared
// humanist-sans character) and Anton (closest free match for Lovelo's bold
// geometric display weight) stand in. Swapping in the real files later is a
// one-line change here once they're available as local font assets.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const arsenal = Arsenal({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "700"],
});
const anton = Anton({
  subsets: ["latin"],
  variable: "--font-subheading",
  weight: ["400"],
});
// Arabic body copy — Cairo has a full weight range and reads well at small sizes.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
});
// Arabic headings/brand wordmark — El Messiri is the closest free stand-in
// for Lafet (a paid Arabic display face) available until the licensed font
// is supplied.
const elMessiri = El_Messiri({
  subsets: ["arabic"],
  variable: "--font-arabic-display",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [locale, siteName] = await Promise.all([getLocale(), withDbTimeout(getSiteName()).catch(() => null)]);
  const name = (locale === "ar" ? siteName?.ar : siteName?.en) ?? "Hamid Afandi";
  return {
    title: `${name.toUpperCase()} | Modern Egyptian Heritage Coffee`,
    description: "Premium coffee, deeply rooted in tradition, crafted for modern coffee lovers.",
    icons: {
      icon: "/icon.png",
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
    },
  };
}

// Declared via the Viewport API (not manual <head> JSX) so Next guarantees it
// on every render path — error pages, streamed responses, etc. Without it,
// real phones render at ~980px virtual width and the desktop layout shows.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F5DC",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const direction = dir(locale);

  return (
    <html lang={locale} dir={direction} className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${arsenal.variable} ${anton.variable} ${cairo.variable} ${elMessiri.variable} ${direction === "rtl" ? "font-arabic" : ""}`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:rounded-lg focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
