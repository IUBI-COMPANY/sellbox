'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import SearchModal from '@/components/layout/SearchModal';

interface Tab {
  href?: string;
  label: string;
  icon: ReactNode;
  isCenter?: boolean;
  isSearching?:boolean,
}

const tabs: Tab[] = [
  { href: '/', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
  { label: 'Buscar', icon: <Search className="w-5 h-5" /> , isSearching:true },
  {
    href: '/upload',
    label: 'Subir',
    icon: <PlusCircle className="w-6 h-6" />,
    isCenter: true,
  },
  {
    href: '/notifications',
    label: 'Alertas',
    icon: <Bell className="w-5 h-5" />,
  },
  { href: '/profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
];

export default function BottomTabs() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isSearchOpen , setIsSearchOpen] = useState(false)

  const isSearch = pathname === '/search';
  
  if (isSearch) return null;
  return (
    <>
      <nav 
      className={`
        fixed bottom-0 left-0 right-0 z-50 md:hidden
        transition-all duration-300
        ${isHome ? 'bg-gradient-to-t from-black/50 to-transparent border-none' : 'glass border-t border-border'}
      `.trim()}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab,index) => {
          const isActive = tab.href ? pathname === tab.href : false;

          if (tab.isCenter && tab.href) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/30 transition-transform duration-200 active:scale-90"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  {tab.icon}
                </div>
              </Link>
            );
          }

          const tabClasses = `
                flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl
                transition-colors duration-200
                ${
                  isActive
                    ? 'text-accent'
                    : isHome
                      ? 'text-white/70 hover:text-white'
                      : 'text-muted hover:text-muted-foreground'
                }
              `.trim()

          if (tab.isSearching) {
              return (
                <button
                  key={`search-${index}`}
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className={tabClasses}
                >
                  {tab.icon}
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            }

          if (tab.href) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={tabClasses}
                >
                  {tab.icon}
                  <span className="text-[10px] font-medium">{tab.label}</span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-accent mt-0.5" />
                  )}
                </Link>
              );
            }

            return null
        })}
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>

    {
      isSearchOpen &&(
        <SearchModal  onClose={()=>setIsSearchOpen(false)}/>
      )
    }
    </>
  );
}
