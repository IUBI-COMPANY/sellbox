"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import VideoActions from "@/components/ui/video-components/VideoActions";
import VideoMobileComponent from "@/components/ui/video-components/VideoMobileComponent";
import VideoDesktopComponent from "@/components/ui/video-components/VideoDesktopComponent";
import MobileDrawer from "@/components/layout/MobileDrawer";
import { INITIAL_VIDEOS, Video } from "@/app/data-list/InitialVideos";

export default function FeedPage() {
  const { theme, setTheme } = useTheme();
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/*
       * OUTER SHELL — fills exactly the content area to the right of the Sidebar.
       *
       * h-full w-full → inherits from the `relative h-full w-full` parent div
       * set by MainLayoutWrapper for the home page. That parent is inside
       * <main class="lg:pl-16 xl:pl-60 h-screen overflow-hidden">, so this
       * div naturally sits to the RIGHT of the Sidebar without any z-index
       * conflicts or fixed-position hacks.
       *
       * bg-black on mobile (true fullscreen) / bg-background on desktop
       * (shows the theme color in the area around the video card).
       */}
      <div className="h-full w-full bg-black lg:bg-background">

        {/*
         * SCROLL CONTAINER
         * h-full fills the outer shell; overflow-y-scroll + snap creates the
         * swipe-feed. On desktop the centering is done per slide.
         */}
        <div
          ref={containerRef}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        >
          {videos.map((video, index) => (
            /*
             * SLIDE
             * h-full = same height as the scroll container = same as the
             * outer shell = the content area height (100vh on desktop,
             * 100dvh on mobile).
             *
             * `relative` lets the mobile VideoActions overlay work.
             * On desktop: flex + items-center + justify-center centers the
             * card+actions row in the content area.
             */
            <div
              key={video.id}
              data-index={index}
              className="relative h-full w-full snap-start snap-always lg:flex lg:items-center lg:justify-center"
            >

              {/* ── MOBILE (hidden lg+) ──────────────────────────────────
                  Full-screen video with VideoActions as an absolute overlay
                  on the right edge, same as TikTok mobile.
              ─────────────────────────────────────────────────────────── */}
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

              {/* ── DESKTOP (hidden below lg) ────────────────────────────
                  VideoDesktopComponent card + VideoActions side-by-side.
                  items-end aligns actions to the card's bottom edge for
                  any card ratio (portrait or landscape).
              ─────────────────────────────────────────────────────────── */}
              <div className="hidden lg:flex lg:items-end lg:gap-4 lg:py-4">
                <VideoDesktopComponent video={video} />

                <div className="flex-shrink-0 pb-5">
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
