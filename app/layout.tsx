import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { AppShell } from "@/components/nav/AppShell";
import Script from "next/script";
import "./styles/tailwind.css";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Algorithms Wizard",
  description:
    "Interactive algorithm visualizations — sorting and searching, with more sections to come.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Script
          id="algo-wiz-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('algo-wiz-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})();",
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
