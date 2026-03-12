import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { FloatingCart } from "@/components/cart/floating-cart";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { SiteFooter } from "@/components/site/footer";
import { HelpChat } from "@/components/site/help-chat";
import { Navbar } from "@/components/site/navbar";
import "./globals.css";

const bodyFont = Roboto({
  variable: "--font-body",
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const headingFont = Roboto({
  variable: "--font-heading",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HubBay | Premium African Fusion in Lagos",
  description:
    "HubBay is a futuristic premium eatery in Lagos serving elevated African fusion meals with wallet-first checkout and real-time tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${headingFont.variable} luxury-bg antialiased`}>
        <AuthSessionProvider>
          <div className="relative min-h-screen overflow-x-clip">
            <div className="pointer-events-none absolute inset-0 grid-overlay opacity-35" />
            <div className="relative z-10">
              <Navbar />
              {children}
              <SiteFooter />
            </div>
            <FloatingCart />
            <HelpChat />
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
