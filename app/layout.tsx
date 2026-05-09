import type { Metadata, Viewport } from "next";
import { fraunces, interTight, jetbrains } from "@/lib/fonts";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trymsaether.no"),
  title: {
    default: "Trym Sæther — Mathematics into software.",
    template: "%s · Trym Sæther",
  },
  description:
    "Portfolio of Trym Sæther — mathematics, simulation software, numerical methods, scientific computing, compiler-adjacent tooling, and technical writing.",
  openGraph: {
    title: "Trym Sæther — Mathematics into software.",
    description:
      "Simulation software, numerical methods, scientific computing, compiler-adjacent tooling, and technical writing — by Trym Sæther.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trym Sæther",
    description: "Mathematics into software.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('theme-cream');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="topo-bg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-md focus:bg-[var(--accent)] focus:text-[var(--on-accent)]"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
