"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User,
  AtSign,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";
import { getPasswordStrength } from "@/utils/getPasswordStrength";

const registerSchema = z.object({
  full_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(30, "El usuario es demasiado largo")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guion bajo"),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo válido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[a-zA-Z]/, "Debe contener al menos una letra")
    .regex(/[0-9]/, "Debe contener al menos un número"),
});

type RegisterFields = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const passwordVal = watch("password");

  const passwordStrength = useMemo(
    () => (passwordVal ? getPasswordStrength(passwordVal) : null),
    [passwordVal],
  );

  async function onSubmit(data: RegisterFields) {
    setLoading(true);
    setServerError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          username: data.username,
          role: "buyer",
        },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setServerError(
          "Este correo ya está registrado. Intenta iniciar sesión.",
        );
      } else {
        setServerError(
          "Ocurrió un error al crear la cuenta. Intenta de nuevo.",
        );
      }
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div className="flex flex-col items-center text-center">
        <Logo size="lg" className="justify-center" />
        <p className="mt-3 text-sm text-neutral-400">
          Crea tu cuenta y empieza hoy
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full py-2">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Crear Cuenta
        </h2>

        {/* Error banner */}
        {serverError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Juan Pérez"
            autoComplete="name"
            icon={<User className="h-4 w-4" />}
            error={errors.full_name?.message}
            disabled={loading}
            {...register("full_name")}
          />

          {/* Username */}
          <Input
            label="Nombre de usuario"
            type="text"
            placeholder="juanperez"
            autoComplete="username"
            icon={<AtSign className="h-4 w-4" />}
            error={errors.username?.message}
            disabled={loading}
            {...register("username", {
              onChange: (e) => {
                setValue("username", e.target.value.toLowerCase(), {
                  shouldValidate: true,
                });
              },
            })}
          />

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
          <div className="space-y-2">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              disabled={loading}
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-500 transition-colors hover:text-neutral-300"
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

            {/* Strength indicator */}
            {passwordStrength && (
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        level <= passwordStrength.score
                          ? passwordStrength.color
                          : "bg-white/[0.06]"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-neutral-500">
                  Seguridad:{" "}
                  <span className="text-neutral-400">
                    {passwordStrength.label}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand to-brand-hover px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:shadow-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando cuenta...
              </span>
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-xs text-neutral-500">o</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-brand transition-colors hover:text-brand-hover"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
