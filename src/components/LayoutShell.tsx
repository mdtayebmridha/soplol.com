"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import HelpModal from "@/components/HelpModal";
import QuickViewModal from "@/components/QuickViewModal";
import MobileBottomNav from "@/components/MobileBottomNav";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";
import SmoothScroll from "@/components/SmoothScroll";

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin pages get no storefront navbar/footer/cart/auth modals
    return (
      <>
        <SmoothScroll />
        <ScrollRevealProvider />
        {children}
      </>
    );
  }

  return (
    <>
      <SmoothScroll />
      <ScrollRevealProvider />
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <AuthModal />
      <HelpModal />
      <QuickViewModal />
      <MobileBottomNav />
    </>
  );
}

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<main className="flex-1">{children}</main>}>
      <ShellContent>{children}</ShellContent>
    </Suspense>
  );
}
