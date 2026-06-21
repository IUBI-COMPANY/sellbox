'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {Home, Search, Bell, User, Settings, UploadIcon} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import type { ReactNode } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
  { href: '/explore', label: 'Explorar', icon: <Search className="w-5 h-5" /> },
  {
    href: '/notifications',
    label: 'Notificaciones',
    icon: <Bell className="w-5 h-5" />,
  },
  { href: '/upload', label: 'Subir video', icon: <UploadIcon className="w-5 h-5" /> },
  { href: '/profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 flex-col w-16 xl:w-60 transition-all duration-300">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center xl:justify-start xl:px-5">
        <div className="xl:hidden">
          <Logo size="sm" className="[&>span]:hidden" />
        </div>
        <div className="hidden xl:block">
          <Logo size="lg" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 xl:px-3 space-y-1">
          {/* Center: Search bar — desktop only */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto mb-5">
              <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                      type="text"
                      placeholder="Buscar productos, videos, creadores..."
                      className="w-full bg-gray-700/30 rounded-full pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 hover:-hover"
                  />
              </div>
          </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
                }
              `.trim()}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="hidden xl:block text-md font-medium">
                {item.label}
              </span>
              {isActive && (
                <span className="hidden xl:block ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings */}
      <div className="py-4 px-2 xl:px-3">
        <Link
          href="/settings"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl
            transition-all duration-200
            ${
              pathname === '/settings'
                ? 'bg-accent/10 text-accent'
                : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
            }
          `.trim()}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="hidden xl:block text-sm font-medium">
            Ajustes
          </span>
        </Link>
      </div>
    </aside>
  );
}
