"use client";

import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Video } from "@/app/data-list/InitialVideos";

interface Props {
  video: Video;
}

export default function VideoDesktopComponent({ video }: Props) {
  const [aspectRatio, setAspectRatio] = useState<string>(
    video.aspect_ratio ?? "9/16",
  );

  const handleLoadedMetadata = (evt: Event) => {
    const player = evt.target as HTMLVideoElement;
    if (player && player.videoWidth && player.videoHeight) {
      setAspectRatio(`${player.videoWidth}/${player.videoHeight}`);
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-black rounded-3xl border border-border/30 shadow-2xl flex-none"
      style={{
        height: "min(844px, calc(100dvh - 5rem))",
        aspectRatio,
        maxWidth: "min(80vw, 1000px)",
      }}
    >
      <MuxPlayer
        playbackId={video.video_url}
        streamType="on-demand"
        autoPlay="muted"
        loop
        playsInline
        primaryColor="#ff6a00"
        onLoadedMetadata={handleLoadedMetadata as any}
        style={
          {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            "--media-object-fit": "cover",
            "--media-object-position": "center",
          } as any
        }
      />

      <div className="absolute w-full left-0 right-0 bottom-0 z-10 px-5 pb-6 pt-24 bg-gradient-to-t from-black/85 via-black/30 to-transparent text-white">
        <div className="space-y-2 w-full">
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
