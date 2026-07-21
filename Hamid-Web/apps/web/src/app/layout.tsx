import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Cairo } from "next/font/google";
import "./globals.css";
import { getLocale, dir } from "@/lib/i18n";
import { getSiteName } from "@/lib/settings/queries";
import { withDbTimeout } from "@/lib/db-timeout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["600", "700"],
});
// Single Arabic font covers both display + body roles — Cairo pairs well
// with Plus Jakarta Sans's geometric character and has a full weight range.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [locale, siteName] = await Promise.all([getLocale(), withDbTimeout(getSiteName()).catch(() => null)]);
  const name = (locale === "ar" ? siteName?.ar : siteName?.en) ?? "Hamid Afandi";
  return {
    title: `${name.toUpperCase()} | Modern Egyptian Heritage Coffee`,
    description: "Premium coffee, deeply rooted in tradition, crafted for modern coffee lovers.",
  };
}

// Declared via the Viewport API (not manual <head> JSX) so Next guarantees it
// on every render path — error pages, streamed responses, etc. Without it,
// real phones render at ~980px virtual width and the desktop layout shows.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8f4",
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
      <body className={`${inter.variable} ${plusJakarta.variable} ${cairo.variable} ${direction === "rtl" ? "font-arabic" : ""}`}>
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
