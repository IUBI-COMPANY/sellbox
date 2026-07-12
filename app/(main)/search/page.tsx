"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MOCK_VIDEOS } from "@/data-list/MockVideos";
import Avatar from "@/components/ui/Avatar";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const query = searchParams.get("q") || "";
  const cleanQuery = query.trim().toLowerCase();


  const results = cleanQuery.length > 0 ? MOCK_VIDEOS.filter((video) => {
    return (
      video.title.toLowerCase().includes(cleanQuery) ||
      video.product.title.toLowerCase().includes(cleanQuery) ||
      video.creator.username.toLowerCase().includes(cleanQuery)
    )
  }) : [];



  return (
    <div className="px-4 pt-4 bg-background -mt-16">

      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} aria-label="Volver">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium text-foreground truncate">
          Resultados para: "{query}"
        </h1>
      </div>


      {results.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {results.map((video) => (
            <button key={video.id} className="flex flex-col text-left ">
              <div className="w-full aspect-9/16 ">
                <img
                  src={`https://image.mux.com/${video.video_url}/thumbnail.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover   rounded-2xl"
                />
              </div>

              <p className="text-sm mt-1 font-medium truncate">
                {video.product.title}
              </p>

              <div className="flex items-center gap-1 mt-0.5">
                <Avatar
                  src={video.creator.avatar_url}
                  alt={video.creator.display_name}
                  fallback={video.creator.display_name}
                  size="sm"
                />
                <p className="text-xs text-muted-foreground truncate">
                  {video.creator.username}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-muted-foreground">
          <p>No se encontraron videos para tu búsqueda.</p>
        </div>
      )}
    </div>
  );
}