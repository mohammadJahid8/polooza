import type { Metadata, Viewport } from "next";
import { Jost, Cinzel, Cormorant_Garamond } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#060F1A",
};

export const metadata: Metadata = {
  title: "Ibiza Palooza VI",
  description: "Los Cuatro Elementos — 30 July – 2 August · Ibiza / Formentera",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Palooza VI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full scroll-smooth",
        jost.variable,
        cinzel.variable,
        cormorant.variable
      )}
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-full flex flex-col overflow-x-hidden",
          "bg-palooza-deep text-palooza-ivory",
          "font-[family-name:var(--font-jost)] font-light"
        )}
      >
        {children}
      </body>
    </html>
  );
}
