import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Cairo } from "next/font/google";
import "./globals.css";
import { getLocale, dir } from "@/lib/i18n";

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

export const metadata: Metadata = {
  title: "HAMID AFANDI | Modern Egyptian Heritage Coffee",
  description:
    "Premium coffee, deeply rooted in tradition, crafted for modern coffee lovers.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const direction = dir(locale);

  return (
    <html lang={locale} dir={direction} className="scroll-smooth">
      <head>
        {/* CRITICAL: without this, real mobile browsers render at ~980px virtual width,
            causing Tailwind md: breakpoints to always be active — hamburger gets hidden,
            desktop nav shows instead. Chrome DevTools emulation sets this automatically,
            which is why it works there but not on real devices. */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fff8f4" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} ${cairo.variable} ${direction === "rtl" ? "font-arabic" : ""}`}>
        {children}
      </body>
    </html>
  );
}
