"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "Ingresa un correo electrónico válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type LoginFields = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleGoogleSignIn() {
    setLoading(true);
    setServerError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/callback`,
        },
    });

    if (error) {
        setServerError("Error al iniciar sesión con Google. Intenta de nuevo.");
        setLoading(false);
    }
    
  }

  const onSubmit = async (data: LoginFields) => {
    setLoading(true);
    setServerError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setServerError(
        authError.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos"
          : "Ocurrió un error al iniciar sesión. Intenta de nuevo.",
      );
      setLoading(false);
      return;
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div className="flex flex-col items-center text-center">
        <Logo size="lg" className="justify-center" />
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          Si no ves, cómo funciona no lo compres
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full py-2">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Iniciar Sesión
        </h2>

        {/* Error banner */}
        {serverError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            disabled={loading}
            {...register("email")}
          />

          {/* Password */}
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            disabled={loading}
            rightAction={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-300"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            }
            {...register("password")}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand to-brand-hover px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:shadow-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-xs text-neutral-500">o</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <button
                    type="button"
                    disabled={loading}
                    onClick={handleGoogleSignIn}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card  py-3 
                    text-sm font-semibold text-foreground transition-all duration-300 hover:bg-black/50 cursor-pointer"
                >
                    
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill="#EA4335"
                            d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.22-3.22C17.56 1.7 15.01 1 12 1 7.36 1 3.39 3.66 1.4 7.56l3.96 3.07C6.29 7.34 8.9 5.04 12 5.04z"
                        />
                        <path
                            fill="#4285F4"
                            d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.45c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.38-4.88 3.38-8.48z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-4.3 1.08-3.1 0-5.71-2.3-6.65-5.39L1.3 16.03C3.3 19.94 7.33 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.35 12.93c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.39 7.3C.5 9.07 0 11.04 0 13.1c0 2.06.5 4.03 1.39 5.8l3.96-3.07c-.24-.72-.38-1.49-.38-2.28z"
                        />
                    </svg>
                    <span>Registrarse con Google</span>
                </button>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-brand transition-colors hover:text-brand-hover"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
