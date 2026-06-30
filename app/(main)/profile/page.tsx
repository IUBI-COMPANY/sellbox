"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogOut, User as UserIcon } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        setUser(authUser);
      } catch {
        // Supabase not configured
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 animate-fade-in">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-card border border-border flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-muted" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Inicia sesión para ver tu perfil
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crea una cuenta o inicia sesión para acceder a tu perfil,
              favoritos y configuración.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="md">
              <a href="/login">Iniciar sesión</a>
            </Button>
            <Button variant="secondary" size="md">
              <a href="/register">Crear cuenta</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Logged in
  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <Avatar src={avatarUrl} fallback={displayName} size="xl" />
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Stats (placeholder) */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Videos", value: "0" },
          { label: "Seguidores", value: "0" },
          { label: "Siguiendo", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-4 text-center"
          >
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button variant="secondary" block size="md">
          Editar perfil
        </Button>
        <Button
          variant="danger"
          block
          size="md"
          loading={loggingOut}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
