"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, Clock } from "lucide-react";
import { MOCK_VIDEOS } from "@/data-list/MockVideos";

import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";

{/* Arreglos DEMO para para historial y accesos a categorias */ }
const RecentSearches = [
  "AnyCast M12 Plus",
  "AnyCast M9 Plus",
  "AnyCast M12 Plus",
  "AnyCast M12 Plus",
 

];

const Categories = [
  { name: "Accesorios" },
  { name: "Multimedia" },
  { name: "Gadgets" },
  { name: "Celulares" },
  { name: "Computadoras" },
];

export default function ExplorePage() {

  const router = useRouter();
  const [query, setQuery] = useState("");

  {/*Elimino espacios en blanco en query y valido el tamaño */ }
  const isSearching = query.trim().length > 0;

  const results = MOCK_VIDEOS.filter((video)=>{
    const search =query.toLowerCase()
    return(
      video.title.toLowerCase().includes(search) ||
      video.product.title.toLowerCase().includes(search) ||
      video.creator.username.toLowerCase().includes(search) 
    )
  })

  return (
    <div className=" px-4 pt-4 -mt-16 lg:hidden">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} >
          <ArrowLeft className="w-6 h-6 " aria-label="Volver" />
        </button>

        <div className="flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Que estas buscando..."
            icon={<Search className="w-5 h-5" />}
            rightAction={
              query.length > 0 ? (
                <button onClick={() => setQuery("")} aria-label="Limpiar">
                  <X className="w-4 h-4" />
                </button>
              ) : null
            }
          />
        </div>
      </div>


      {
        !isSearching && (
          <>

            <div className="mt-4 space-y-5">
              {RecentSearches.map((text, index) => (
                <div key={index} className="flex  gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground " />
                  <p className="text-sm text-foreground truncate">{text}</p>
                </div>
              ))}
              <div className="flex justify-center">
                <button className=" text-muted-foreground">Ver mas...</button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 mt-5 ">
              {
                Categories.map((cat) => (
                  <button
                    className="flex flex-col items-center gap-2"
                    key={cat.name}>

                    <div className="w-14 h-14 rounded-full bg-card border border-border flex justify-center items-center ">
                      <span>img</span>
                    </div>

                    <span className="text-sm text-muted-foreground">{cat.name}</span>
                  </button>
                ))
              }
            </div>

          </>
        )
      }


      {
        isSearching &&(
          <div className=" grid grid-cols-3 gap-2 mt-4">
            {results.map((video)=>(

              <button key={video.id} className="flex flex-col text-left">
                <div className="w-full aspect-[9/16] bg-card rounded-2xl overflow-hidden ">
                  <img src={`https://image.mux.com/${video.video_url}/thumbnail.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover"/>
                </div>

                <p className="text-sm mt-1 ">
                  {video.product.title}
                </p>
                <div className="flex items-center  gap-1">
                  <Avatar src={video.creator.avatar_url}
                  alt={video.creator.display_name}
                  fallback={video.creator.display_name}
                  size="sm"/>
                  <p className="text-xs">
                  {video.creator.username}
                </p>
                </div>

              </button>

            ))}
          </div>
        )
      }





    </div>
  );
}