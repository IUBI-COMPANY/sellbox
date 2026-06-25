import React from "react";
import { Menu, Search } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { Video } from "@/app/data-list/MockVideos";

interface Props {
  video: Video;
  onSetMenuOpen: (open: boolean) => void;
}

export default function VideoMobileComponent({ video, onSetMenuOpen }: Props) {
  return (
    <section className="relative w-full h-full overflow-hidden bg-black">
      <MuxPlayer
        playbackId={video.video_url}
        streamType="on-demand"
        autoPlay="muted"
        loop
        playsInline
        primaryColor="#ff6a00"
        style={
          {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            "--media-object-fit": "contain",
            "--media-object-position": "center",
          } as any
        }
      />

      <header className="absolute w-full top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <button
          onClick={() => onSetMenuOpen(true)}
          className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors pointer-events-auto"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex gap-4 text-white font-semibold text-lg pointer-events-auto">
          <span className="border-b-2 border-accent pb-1 cursor-pointer">
            Inicio
          </span>
          <span className="text-white/60 hover:text-white pb-1 cursor-pointer">
            Siguiendo
          </span>
        </div>

        <button className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors pointer-events-auto">
          <Search className="w-6 h-6" />
        </button>
      </header>

      <div className="absolute w-full left-0 right-0 bottom-0 z-10 px-4 pb-5 pt-20 bg-gradient-to-t from-black/85 via-black/30 to-transparent text-white">
        <div className="space-y-2 w-full">
          <div className="txt-items w-full max-w-[calc(100vw-6rem)]">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base hover:underline cursor-pointer">
                @{video.creator.username}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-lg tracking-tight">
                {video.title}
              </h1>
              <button className="px-2 py-0.5 text-[10px] font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/10 rounded-full transition-colors">
                Más videos
              </button>
            </div>
            <p className="text-sm text-neutral-200 line-clamp-2 leading-relaxed mb-4">
              {video.description}
            </p>
          </div>
          <a
            href={video.product.whatsapp_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center py-3 px-6 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/25 hover:shadow-accent/40"
            style={{ background: "var(--gradient-brand)" }}
          >
            COMPRAR POR WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
}
