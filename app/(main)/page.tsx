"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import VideoActions from "@/components/ui/video-components/VideoActions";
import MobileDrawer from "@/components/layout/MobileDrawer";
import VideoComponent from "@/components/ui/video-components/VideoComponent";
import { INITIAL_VIDEOS, Video } from "@/app/data-list/InitialVideos";

export default function FeedPage() {
  const { theme, setTheme } = useTheme();
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Video Autoplay logic on Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement;
          const index = videoRefs.current.indexOf(videoElement);

          if (entry.isIntersecting) {
            setCurrentVideoIndex(index);
            videoElement.play().catch(() => {});
          } else {
            videoElement.pause();
            videoElement.currentTime = 0;
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // Trigger when 60% of the video is visible
      },
    );

    // Filter out null refs and observe
    const currentRefs = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    currentRefs.forEach((ref) => observer.observe(ref));

    return () => {
      currentRefs.forEach((ref) => observer.unobserve(ref));
    };
  }, [videos]);

  return (
    <>
      <div className="h-full w-full relative flex justify-center items-center transition-colors duration-300">
        {/* Home Feed Container */}
        <div
          ref={containerRef}
          className="h-auto w-full lg:h-screen relative overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        >
          {/* Video Snapping List */}
          {videos.map((video, index) => {
            const isActive = index === currentVideoIndex;

            return (
              <div
                key={video.id}
                className="components-wrapper h-full w-full flex justify-center items-center snap-start snap-always relative"
              >
                <div className="video-wrapper lg:my-4 py-4 w-full max-w-[60vw] h-full max-h-[calc(100vh-1rem)] flex justify-center items-end gap-4">
                  <div className="wrapper m-auto h-full w-auto flex flex-col justify-center gap-1">
                    <VideoComponent
                      index={index}
                      video={video}
                      videoRefs={videoRefs}
                      onSetMenuOpen={setMenuOpen}
                    />
                    {/*<section className="wrapper-button">*/}
                    {/*  <Button*/}
                    {/*    type="button"*/}
                    {/*    variant="primary"*/}
                    {/*    className="w-full my-1"*/}
                    {/*  >*/}
                    {/*    Registrarse*/}
                    {/*  </Button>*/}
                    {/*</section>*/}
                  </div>
                  <VideoActions
                    index={index}
                    currentVideoIndex={currentVideoIndex}
                    video={video}
                    videos={videos}
                    onSetVideos={setVideos}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hamburger / Settings Left Drawer (TikTok-style menu with Theme switches) */}
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
