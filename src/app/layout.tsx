import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import LayoutShell from "@/components/LayoutShell";
import Toast from "@/components/Toast";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF9F6",
};

export const metadata: Metadata = {
  title: "soplol - Fashion, Gifts, Home & Office",
  description: "Browse the soplol catalog for fashion, gifts, home decor, and office accessories. Bangladesh checkout is available.",
  icons: {
    icon: [{ url: "/favicon.png?v=5", type: "image/png" }, { url: "/favicon.ico?v=5" }],
    shortcut: "/favicon.png?v=5",
    apple: "/logo.png?v=5",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.png?v=5" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png?v=5" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png?v=5" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-stone-900 font-sans">
        <ShopProvider>
          <LayoutShell>{children}</LayoutShell>
          <Toast />
        </ShopProvider>
      </body>
    </html>
  );
}
