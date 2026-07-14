"use client";
import React, { useState } from "react";
import { Check, ChevronRight, Laptop, Moon, Sun, X } from "lucide-react";
import { Theme } from "@/components/providers/ThemeProvider";
import SidebarMobile from "@/components/layout/SidebarMobile";
import Logo from "../ui/Logo";

interface Props {
  onSetMenuOpen: (isOpen: boolean) => void;
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
}

export default function MobileDrawer({
  onSetMenuOpen,
  theme,
  onSetTheme,
}: Props) {

  const [currentView, setCurrentView] = useState<"menu" | "settings">("menu");

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => onSetMenuOpen(false)}
      />
      <div className="relative w-80 max-w-[85%] h-full bg-card border-r border-border p-6 flex flex-col justify-between shadow-2xl animate-fade-in z-10">
        {currentView === "menu" && (
          <div className="flex flex-col h-full justify-between" >
            <div className="flex items-center justify-between pb-4">
              <Logo size="lg" />
              <button onClick={() => onSetMenuOpen(false)}>
                <X />
              </button>
            </div>

            <SidebarMobile
              onCloseMenu={() => onSetMenuOpen(false)}
              onSettings={() => setCurrentView("settings")} />
          </div>
        )}

        {/* Drawer content */}
        {currentView === "settings" && (
          <div className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Ajustes</h2>
              <button
                onClick={() => onSetMenuOpen(false)}
                className="p-1 rounded-full hover:bg-card-hover text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme Settings Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
                Tema de la aplicación
              </label>
              <div className="space-y-1.5">
                {[
                  { value: "light", label: "Modo Claro", icon: Sun },
                  { value: "dark", label: "Modo Oscuro", icon: Moon },
                  { value: "system", label: "Sistema", icon: Laptop },
                ].map((t) => {
                  const isSelected = theme === t.value;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      onClick={() => onSetTheme(t.value as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${isSelected
                        ? "bg-accent/10 border-accent/40 text-accent shadow-sm"
                        : "bg-card-hover/20 border-border/50 text-muted-foreground hover:bg-card-hover hover:text-foreground"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{t.label}</span>
                      {isSelected && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick links info */}
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm py-2 text-muted-foreground hover:text-foreground cursor-pointer">
                <span>Acerca de Sellbox</span>
                <ChevronRight className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between text-sm py-2 text-muted-foreground hover:text-foreground cursor-pointer">
                <span>Términos y condiciones</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            </div>

            {/* Version */}
            <div className="text-xs text-muted text-center pt-4 border-t border-border">
              Sellbox v1.0.0
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
