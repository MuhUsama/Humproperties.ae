import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant" 
});

export const metadata: Metadata = {
  title: "HUM Properties | Luxury Properties in Dubai",
  description: "Discover exclusive luxury properties in Dubai with HUM Properties.",
  metadataBase: new URL("https://humproperties.ae"),
  openGraph: {
    title: "HUM Properties | Luxury Properties in Dubai",
    description: "Discover exclusive luxury properties in Dubai with HUM Properties.",
    url: "https://humproperties.ae",
    siteName: "HUM Properties",
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HUM Properties | Luxury Properties in Dubai",
    description: "Discover exclusive luxury properties in Dubai with HUM Properties.",
  },
};

import { prisma } from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dbSettings = await prisma.setting.findMany();
  const siteInfo = dbSettings.reduce((acc, cur) => {
    acc[cur.key] = cur.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/hero_poster.jpg" fetchPriority="high" />
        <link rel="preload" as="video" href="/hero_section_video.webm" />
      </head>
      <body className={`${montserrat.variable} ${cormorant.variable} font-sans antialiased bg-[#faf9f7] text-brand-black`}>
        <Providers siteInfo={siteInfo}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
