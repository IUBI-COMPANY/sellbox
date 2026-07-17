"use client";

import { ProfileData } from "@/app/(main)/profile/page";
import { X,Camera } from "lucide-react"; 
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";

interface EditProfileModalProps {
    onClose: () => void;
    initialData: ProfileData | null;
    onProfileUpdate: (updatedProfile: ProfileData) => void;
}

export default function EditProfileModal({ onClose, initialData, onProfileUpdate }: EditProfileModalProps) {
    const [username, setUsername] = useState(initialData?.username || "");
    const [fullName, setFullName] = useState(initialData?.full_name || "");
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imageProfilePreview, setImageProfilePreview] = useState(initialData?.avatar_url || "");
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const supabase = createClient();

    const fileImgRef = useRef<HTMLInputElement>(null)

    const handleAvatarClick = () => {
        fileImgRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setImagenFile(file)

            setImageProfilePreview(URL.createObjectURL(file))
        }
    }




    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!initialData?.id) return;

        setSaving(true);
        setErrorMsg(null);

        try {
            let finalAvatarImgUrl = initialData.avatar_url

            if (imagenFile) {

                const fileExt = imagenFile.name.split(".").pop()
                const fileName = `${initialData.id}-${Date.now()}.${fileExt}`
                const filePath = `avatars/${fileName}`

                const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, imagenFile, { upsert: true })

                if (uploadError) {
                    throw new Error("No se pudo subir la foto de perfil, Intentelo nuevamente")
                }

                const { data: { publicUrl } } = await supabase.storage.from("avatars").getPublicUrl(filePath)

                finalAvatarImgUrl = publicUrl

            }

            const { data, error } = await supabase.from("profiles").update({
                full_name: fullName,
                username: username.trim().toLowerCase(),
                avatar_url: finalAvatarImgUrl

            }).eq("id", initialData.id).select().single()

            if (error) {
                if (error.code === "23505") {
                    throw new Error("El nombre de usuario ya está en uso.");
                }

                throw new Error(`Error de Supabase (${error.code}): ${error.message}`);
            }

            if (data) {
                onProfileUpdate(data as ProfileData)
                setSaving(false)
                onClose()
            }

        } catch (error: any) {
            setErrorMsg(error.message || "Ocurrió un error inesperado.");
            setSaving(false);
        }


    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-background rounded-3xl border border-border p-6 shadow-2xl">

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-foreground mb-6">Editar perfil</h2>

                <form onSubmit={handleSave} className="space-y-5">

                    {errorMsg && (
                        <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                            {errorMsg}
                        </div>
                    )}


                    <div className="flex flex-col items-center gap-2 ">
                        <span className="text-xs font-semibold text-muted-foreground ">Foto de perfil</span>

                        <div
                            onClick={handleAvatarClick}
                            className="relative group cursor-pointer w-24 h-24 rounded-full  border-2 border-border hover:border-accent ">
                            <Avatar
                                src={imageProfilePreview}
                                fallback={fullName || initialData?.full_name || "?"}
                                size="sm"
                                className="w-full h-full"
                            />


                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>


                        <input
                            type="file"
                            ref={fileImgRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <p className="text-xs text-muted-foreground ">Haz clic en el círculo para cambiar tu foto</p>
                    </div>


                    <div >
                        <label className="text-xs font-semibold text-muted-foreground">Nombre Completo</label>
                        <Input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Escribe tu nombre"
                            required
                        />
                    </div>

                    <div >
                        <label className="text-xs font-semibold text-muted-foreground">Nombre de usuario</label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ejemplo123"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        block
                        size="md"
                        loading={saving}
                        className="mt-2"
                    >
                        Guardar cambios
                    </Button>
                </form>
            </div>
        </div>
    );
}