"use client";

import { X } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

interface RegisterModalProps {
  onClose: () => void;
}

export default function RegisterModal({ onClose }: RegisterModalProps) {
  return (
    
    <div className="fixed inset-0 z-51 flex items-center justify-center bg-black/60 backdrop-blur-md">
      
      
      <div className="relative w-full max-w-md bg-background rounded-3xl border border-border p-6">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        
        <RegisterForm onSuccess={onClose} />
      </div>
    </div>
  );
}