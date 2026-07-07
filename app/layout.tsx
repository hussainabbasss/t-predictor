import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";

import { ThemeProvider } from "@/lib/theme/theme-provider";
import { ThemeScript } from "@/lib/theme/theme-script";

import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Trump Predictor — AI geopolitical analysis",
  description:
    "Explore how Donald Trump responded to geopolitical and economic events across two terms — and reasoned predictions for new scenarios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${instrumentSerif.variable} ${dmSans.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
