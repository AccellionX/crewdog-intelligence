import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Sora } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrewDog AI – Intelligence Engine 2.0",
  description:
    "Premium SaaS demo for Colin Rawlinson: hybrid semantic search, transferable skills matching, hiring intelligence and employer discovery for oil & gas.",
  openGraph: {
    title: "CrewDog AI – Intelligence Engine 2.0",
    description: "Matching oil & gas professionals through transferable skills — not keywords.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${outfit.variable} ${jetbrains.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
