"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface MainLayoutWrapperProps {
  children: React.ReactNode;
  navbar?: React.ReactNode;
  sidebar: React.ReactNode;
  bottomTabs: React.ReactNode;
}

export default function MainLayoutWrapper({
  children,
  navbar = null,
  sidebar,
  bottomTabs,
}: MainLayoutWrapperProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Render Navbar: on home page, it is desktop-only; otherwise, it is always visible */}
      {navbar && (
        <div className={isHome ? "hidden lg:block" : "block"}>{navbar}</div>
      )}

      {/* Sidebar (desktop only, handled in Sidebar component) */}
      {sidebar}

      {/* Main content area */}
      <main
        className={`
          transition-all duration-300
          ${
            isHome
              ? "h-screen w-full relative overflow-hidden"
              : "pt-16 pb-20 md:pb-4"
          }
        `.trim()}
      >
        <div
          className={
            isHome
              ? "relative h-full w-full bg-background"
              : "min-h-[calc(100vh-4rem)]"
          }
        >
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tabs */}
      {bottomTabs}
    </div>
  );
}
