import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AssistantLauncher } from "@/components/agents/AssistantLauncher";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: {
    default: "Halcyra Life Sciences | Instruments for discovery",
    template: "%s | Halcyra Life Sciences",
  },
  description:
    "Halcyra Life Sciences designs instruments for genomics, cell analysis, imaging, mass spectrometry, automation and bioprocessing for universities, government laboratories and hospitals. A fictional company for demonstration purposes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <AssistantLauncher />
      </body>
    </html>
  );
}
