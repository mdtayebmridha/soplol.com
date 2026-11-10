import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import LayoutShell from "@/components/LayoutShell";
import Toast from "@/components/Toast";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F3EDE3",
};

export const metadata: Metadata = {
  title: "soplol - Fashion, Gifts, Home & Office",
  description: "Browse the soplol catalog for fashion, gifts, home decor, and office accessories. Bangladesh checkout is available.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F3EDE3] text-stone-900 font-sans">
        <ShopProvider>
          <LayoutShell>{children}</LayoutShell>
          <Toast />
        </ShopProvider>
      </body>
    </html>
  );
}
