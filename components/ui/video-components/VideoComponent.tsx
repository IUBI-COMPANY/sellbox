import React from "react";
import { Menu, Search } from "lucide-react";
import { Video } from "@/app/(main)/page";

interface Props {
  index: number;
  video: Video;
  videoRefs: React.RefObject<(HTMLVideoElement | null)[]>;
  onSetMenuOpen: (open: boolean) => void;
}

export default function VideoComponent({
  index,
  video,
  videoRefs,
  onSetMenuOpen,
}: Props) {
  // Handle Play/Pause on Click
  const handleVideoClick = (index: number) => {
    const videoElement = videoRefs.current[index];
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play().catch(() => {});
    } else {
      videoElement.pause();
    }
  };

  return (
    <section className="items-wrapper relative w-full min-w-[27vw]  h-auto min-h-[calc(100vh-5rem)] bg-linear-to-b bg-black from-black/60 to-transparent lg:rounded-3xl lg:border lg:border-border/40 overflow-hidden">
      {/* Transparent Header */}
      <header className="absolute w-full top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4">
        <button
          onClick={() => onSetMenuOpen(true)}
          className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex gap-4 text-white font-semibold text-lg">
          <span className="border-b-2 border-accent pb-1 cursor-pointer">
            Inicio
          </span>
          <span className="text-white/60 hover:text-white pb-1 cursor-pointer">
            Siguiendo
          </span>
        </div>
        <button className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors">
          <Search className="w-6 h-6" />
        </button>
      </header>
      {/* HTML5 Video element */}
      <video
        ref={(el) => {
          videoRefs.current[index] = el;
        }}
        src={video.video_url}
        loop
        playsInline
        onClick={() => handleVideoClick(index)}
        className="h-full w-full object-cover cursor-pointer"
      />
      {/* Bottom Overlay (Info details & WhatsApp CTA) */}
      <div className="absolute w-full left-0 right-0 bottom-0 z-10 px-4 pb-5 pt-20 bg-linear-to-t from-black/80 via-black/40 to-transparent text-white">
        <div className="space-y-2 w-full">
          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base hover:underline cursor-pointer">
              @{video.creator.username}
            </h3>
          </div>

          {/* Video Title & "Más videos" pill */}
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg tracking-tight">
              {video.title}
            </h1>
            <button className="px-2 py-0.5 text-[10px] font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/10 rounded-full transition-colors">
              Más videos
            </button>
          </div>
          {/* Description */}
          <p className="text-sm text-neutral-200 line-clamp-2 leading-relaxed mb-4">
            {video.description}
          </p>
          {/* WhatsApp Purchase CTA */}
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
