'use client';

import { useState } from 'react';
import { Search, Bell, Upload, Sun, Moon } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeProvider';

interface NavbarProps {
  user?: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass h-16">
      <div className="h-full flex items-center justify-between px-4 lg:pl-64 xl:pl-64">
        {/* Left: Logo (visible on mobile, hidden on lg+ where sidebar has it) */}
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>

        {/* Center: Search bar — desktop only */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Buscar productos, videos, creadores..."
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 hover:border-border-hover"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-card-hover transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Upload button */}
          <Link
            href="/upload"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir</span>
          </Link>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative p-2 rounded-xl hover:bg-card-hover transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </Link>

          {/* Theme toggler */}
          <button
            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl hover:bg-card-hover text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cambiar tema"
          >
            {resolvedTheme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Avatar / Profile */}
          <Link href="/profile" className="ml-1">
            <Avatar
              src={user?.user_metadata?.avatar_url}
              fallback={user?.user_metadata?.full_name || user?.email || '?'}
              size="sm"
            />
          </Link>
        </div>
      </div>

      {/* Mobile search dropdown */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 glass border-t border-border animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Buscar..."
              autoFocus
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        </div>
      )}
    </header>
  );
}
