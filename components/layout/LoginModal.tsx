"use cliente";
import { X } from "lucide-react"
import LoginForm from "../auth/LoginForm";

interface LoginModalProps {
    onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
    return (
        <div className="fixed inset-0 z-52 flex items-center justify-center bg-black/60 backdrop-blur-md">

            <div className="relative w-full max-w-md bg-background rounded-3xl border border-border p-6 ">
                <button className="absolute right-4 top-4 text-muted-foreground"
                    onClick={ onClose}>
                    <X />
                </button>

                <LoginForm />
            </div>
        </div>
    )
}