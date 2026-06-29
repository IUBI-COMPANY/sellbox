"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import VideoActions from "@/components/ui/video-components/VideoActions";
import VideoMobileComponent from "@/components/ui/video-components/VideoMobileComponent";
import VideoDesktopComponent from "@/components/ui/video-components/VideoDesktopComponent";
import MobileDrawer from "@/components/layout/MobileDrawer";
import { MOCK_VIDEOS, Video } from "@/data-list/MockVideos";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function FeedPage() {
  const { theme, setTheme } = useTheme();
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToVideo = (index: number) => {
    const root = containerRef.current;
    if (!root) return;
    const slide = root.querySelector(`[data-index="${index}"]`);
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      scrollToVideo(currentVideoIndex - 1);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      scrollToVideo(currentVideoIndex + 1);
    }
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setCurrentVideoIndex(idx);
          }
        });
      },
      { root, threshold: 0.6 },
    );

    const slides = root.querySelectorAll<HTMLElement>("[data-index]");
    slides.forEach((el) => observer.observe(el));
    return () => slides.forEach((el) => observer.unobserve(el));
  }, [videos]);

  // Support keyboard navigation (ArrowUp/ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.hasAttribute("contenteditable"));
      if (isInput) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevVideo();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNextVideo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentVideoIndex, videos.length]);

  return (
    <>
      <div className="h-full w-full bg-black lg:bg-background relative">
        <div
          ref={containerRef}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              data-index={index}
              className="relative h-full w-full snap-start snap-always lg:flex lg:items-center lg:justify-center"
            >
              {/* ── MOBILE (hidden lg+) ─────────*/}
              <div className="lg:hidden w-full h-full">
                <VideoMobileComponent
                  video={video}
                  onSetMenuOpen={setMenuOpen}
                />
              </div>

              <div className="lg:hidden absolute right-3 bottom-24 z-20">
                <VideoActions
                  index={index}
                  currentVideoIndex={currentVideoIndex}
                  video={video}
                  videos={videos}
                  onSetVideos={setVideos}
                />
              </div>

              {/* ── DESKTOP (hidden below lg) ──────*/}
              <div className="hidden lg:flex lg:items-center lg:gap-4 lg:py-4 lg:items-end">
                <VideoDesktopComponent video={video} />

                <div className="flex-shrink-0">
                  <VideoActions
                    index={index}
                    currentVideoIndex={currentVideoIndex}
                    video={video}
                    videos={videos}
                    onSetVideos={setVideos}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation controls (Desktop only) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3">
          <button
            onClick={handlePrevVideo}
            disabled={currentVideoIndex === 0}
            className={`
              p-3 rounded-full bg-neutral-800/80 hover:bg-neutral-700/90 text-white border border-white/10
              transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer
              disabled:opacity-30 disabled:pointer-events-none hover:scale-110 active:scale-95
            `}
            aria-label="Video anterior"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextVideo}
            disabled={currentVideoIndex === videos.length - 1}
            className={`
              p-3 rounded-full bg-neutral-800/80 hover:bg-neutral-700/90 text-white border border-white/10
              transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer
              disabled:opacity-30 disabled:pointer-events-none hover:scale-110 active:scale-95
            `}
            aria-label="Siguiente video"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile-only settings drawer */}
      {menuOpen && (
        <MobileDrawer
          onSetMenuOpen={setMenuOpen}
          onSetTheme={setTheme}
          theme={theme}
        />
      )}
    </>
  );
}
