"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  FileVideo,
  Home,
  MessageCircle,
  MessageSquare,
  Plus,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "GESTIÓN",
    items: [
      {
        href: "/sellboxstudio",
        label: "Inicio",
        icon: <Home className="w-[18px] h-[18px]" />,
      },
      {
        href: "/sellboxstudio/posts",
        label: "Publicaciones",
        icon: <FileVideo className="w-[18px] h-[18px]" />,
      },
      {
        href: "/sellboxstudio/comments",
        label: "Comentarios",
        icon: <MessageSquare className="w-[18px] h-[18px]" />,
      },
    ],
  },
  {
    title: "OTROS",
    items: [
      {
        href: "/sellboxstudio/feedback",
        label: "Feedback",
        icon: <MessageCircle className="w-[18px] h-[18px]" />,
      },
    ],
  },
];

export default function StudioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col w-56 border-r border-border bg-background">
      <div className="flex flex-col h-full">
        {/* Header: Logo */}
        <div className="h-14 flex items-center px-5 border-b border-border shrink-0">
          <Link href="/sellboxstudio" className="flex items-center group">
            <Logo size="sm" />
            <span className="text-sm font-semibold text-muted-foreground tracking-wide">
              Studio
            </span>
          </Link>
        </div>

        {/* Upload CTA Button */}
        <div className="px-3 pt-4 pb-2 shrink-0">
          <Link
            href="/sellboxstudio/upload"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Button variant="primary" block>
              <Plus className="w-4 h-4" />
              Subir
            </Button>
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto scrollbar-none py-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-1">
              <p className="px-5 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {section.title}
              </p>
              <div className="px-2 space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/sellboxstudio" &&
                      pathname.startsWith(item.href));
                  const isExactHome =
                    item.href === "/sellboxstudio" &&
                    pathname === "/sellboxstudio";

                  const active = isActive || isExactHome;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg
                        transition-all duration-150 text-sm
                        ${
                          active
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-foreground/70 hover:text-foreground hover:bg-card-hover"
                        }
                      `.trim()}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section: Go back to SellBox */}
        <div className="p-3 border-t border-border shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-card-hover transition-all duration-150"
          >
            <ChevronLeft className="w-[18px] h-[18px]" />
            <span>Volver a SellBox</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
