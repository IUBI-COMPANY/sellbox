"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, Clock } from "lucide-react";
import Input from "@/components/ui/Input";

const RecentSearches:string[]  = []


const Categories = [
    { name: "Accesorios" },
    { name: "Multimedia" },
    { name: "Gadgets" },
    { name: "Celulares" },
    { name: "Computadoras" }
];

interface SearchModalProps {
    onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {

    const router = useRouter();
    const [query, setQuery] = useState("");
    
    
    const handleSearchSubmit = (search: string) => {
        if (!search.trim()) return;
        onClose();
        RecentSearches.push(search)
        router.push(`/search?q=${encodeURIComponent(search.trim())}`)
    }

    return (

        <div className="fixed inset-0  z-50 bg-background px-4 pt-4 lg:hidden  ">
            
            <div className="flex items-center gap-3">
                <button onClick={onClose} aria-label="Volver">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex-1">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearchSubmit(query);
                        }}
                    >
                        <Input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Que estas buscando..."
                            icon={<Search className="w-5 h-5" />}
                            rightAction={
                                query.length > 0 ? (
                                    <button type="button" onClick={() => setQuery("")} aria-label="Limpiar">
                                        <X className="w-4 h-4" />
                                    </button>
                                ) : null
                            }
                        />
                    </form>
                </div>
            </div>

            
            <div className="mt-4 space-y-5">
                {RecentSearches.toReversed().map((text, index) => (
                    <div
                        key={index}
                        className="flex gap-3 items-center cursor-pointer"
                        onClick={() => handleSearchSubmit(text)}
                    >
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <p className="text-sm text-foreground truncate">{text}</p>
                    </div>
                ))}
            </div>

            
            <div className="grid grid-cols-5 gap-3 mt-5">
                {Categories.map((cat) => (
                    <button
                        className="flex flex-col items-center gap-2"
                        key={cat.name}
                        onClick={() => handleSearchSubmit(cat.name)}
                    >
                        <div className="w-14 h-14 rounded-full bg-card border border-border flex justify-center items-center">
                            <span>img</span>
                        </div>
                        <span className="text-sm text-muted-foreground break-all">{cat.name}</span>
                    </button>
                ))}
            </div>
            
        </div>
    );


}