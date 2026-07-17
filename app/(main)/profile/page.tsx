"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogOut, User as UserIcon, PencilLine, Heart, Table, Bookmark, History, MoreVertical } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import type { User } from "@supabase/supabase-js";
import RegisterModal from "@/components/layout/RegisterModal";
import LoginModal from "@/components/layout/LoginModal";

import EditProfileModal from "@/components/layout/EditProfileModal";

export interface ProfileData {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;

}

type TabType = "videos" | "likes" | "favorites" | "history";


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const [openLoginModal, setOpenLoginModal] = useState(false)

  const [tab, setTab] = useState<TabType>("videos");
  const [showMenu, setShowMenu] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null);


  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        setUser(authUser);

        if (authUser) {
          const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();

          if (!error && profileData) {
            setProfile(profileData as ProfileData)
          }
        }

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
            <Button variant="primary" size="md"
              onClick={() => setOpenLoginModal(true)}>
              Iniciar Sesión
            </Button>
            <Button variant="secondary" size="md"
              onClick={() => setOpenRegisterModal(true)}>
              <span>Crear cuenta</span>
            </Button>
          </div>
        </div>
        {
          openRegisterModal && (
            <RegisterModal onClose={() => setOpenRegisterModal(false)} />
          )
        }

        {
          openLoginModal && (
            <LoginModal onClose={() => setOpenLoginModal(false)} />
          )
        }

      </div>
    );
  }


  // Logged in
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";
  const avatarUrl = profile?.avatar_url || (user.user_metadata?.avatar_url as string | undefined);

  return (
    <div className="relative max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="absolute right-4 top-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-card border border-transparent hover:border-border rounded-full transition-all duration-200 cursor-pointer text-foreground"
        >
          <MoreVertical className="w-6 h-6" />
        </button>


        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border p-2 ">
            <Button
              variant="danger"
              block
              size="sm"
              loading={loggingOut}
              onClick={handleLogout}
              className="flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>

      {/* Profile header */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <Avatar src={avatarUrl} fallback={displayName} size="xl" />
        <div className="text-center space-y-1">
          <div className="flex justify-center items-center gap-5">
            <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
            <button
              onClick={() => setOpenEditProfile(true)}>
              <PencilLine className="w-4 h-4" />
            </button>
          </div>
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


      <div className="border-t border-b border-border py-2 mb-6">
        <div className="grid grid-cols-4 justify-items-center w-full">
          <button
            onClick={() => setTab("videos")}
            className={`p-2 rounded-lg  cursor-pointer ${tab === "videos" ? "text-foreground bg-card" : "text-muted hover:text-foreground"}`}
          >
            <Table className="w-6 h-6" />
          </button>
          <button
            onClick={() => setTab("likes")}
            className={`p-2 rounded-lg  cursor-pointer ${tab === "likes" ? "text-foreground bg-card" : "text-muted hover:text-foreground"}`}
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            onClick={() => setTab("favorites")}
            className={`p-2 rounded-lg  cursor-pointer ${tab === "favorites" ? "text-foreground bg-card" : "text-muted hover:text-foreground"}`}
          >
            <Bookmark className="w-6 h-6" />
          </button>
          <button
            onClick={() => setTab("history")}
            className={`p-2 rounded-lg  cursor-pointer ${tab === "history" ? "text-foreground bg-card" : "text-muted hover:text-foreground"}`}
          >
            <History className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div >
        {tab === "videos" && (
          <div className="text-center py-8 text-sm text-muted-foreground">Videos publicados</div>
        )}
        {tab === "likes" && (
          <div className="text-center py-8 text-sm text-muted-foreground">Videos que te gustan</div>
        )}
        {tab === "favorites" && (
          <div className="text-center py-8 text-sm text-muted-foreground">Videos guardados como favoritos</div>
        )}
        {tab === "history" && (
          <div className="text-center py-8 text-sm text-muted-foreground">Historial de visualizacion</div>
        )}
      </div>


      {
        openEditProfile && (
          <EditProfileModal
            initialData={{
              id: profile?.id || user?.id || "",
              username: profile?.username || "",
              full_name: profile?.full_name || user?.user_metadata?.full_name || "",
              avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url || ""
            }}
            onClose={() => setOpenEditProfile(false)}
            onProfileUpdate={(updatedProfile) => setProfile(updatedProfile)}
          />
        )}
      
    </div>
  );
}
