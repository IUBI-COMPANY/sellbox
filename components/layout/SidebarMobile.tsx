"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Search } from "lucide-react";
import { navItems } from "@/components/layout/Sidebar";
import { useTheme } from "@/components/providers/ThemeProvider";



interface SidebarMobileProps {
    onCloseMenu: () => void;
    onSettings: () => void;
}

export default function SidebarMobile({ onCloseMenu, onSettings }: SidebarMobileProps) {
    const pathname = usePathname()
    const theme = useTheme();

    const { resolvedTheme = null } = theme;
    return (
        <div className="flex flex-col h-full justify-between">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                    type="text"
                    placeholder="Buscar productos, videos, creadores..."
                    className={`w-full bg-gray-400/30 ${resolvedTheme === "dark" ? "hover:bg-gray-400/40" : "hover:bg-gray-700/20"} rounded-full pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50`}
                />
            </div>
            
            <nav className="flex-1 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onCloseMenu}
                            className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl
                            transition-all duration-200 group
                            ${isActive
                                    ? "bg-accent/10 text-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
                                }
                            `.trim()}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className="text-sm font-medium">
                                {item.label}
                            </span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent " />
                            )}
                        </Link>
                    );
                })}
            </nav>
            <div className="py-4">
                <button
                    onClick={onSettings}
                    className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200
                    text-muted-foreground hover:text-foreground hover:bg-card-hover
                    `.trim()}
                >
                    <Settings className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">Ajustes</span>
                </button>
            </div>

        </div>
    )

}