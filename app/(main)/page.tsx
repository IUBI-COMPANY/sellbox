"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import VideoActions from "@/components/ui/video-components/VideoActions";
import MobileDrawer from "@/components/layout/MobileDrawer";
import VideoComponent from "@/components/ui/video-components/VideoComponent";

export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  creator: {
    username: string;
    display_name: string;
    avatar_url?: string;
    is_followed: boolean;
  };
  likes: number;
  comments_count: number;
  shareds_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  product: {
    id: string;
    title: string;
    price: string;
    whatsapp_link: string;
  };
}

const INITIAL_VIDEOS: Video[] = [
  {
    id: "1",
    title: "AnyCast M12 PLUS",
    description:
      "Dispositivo para duplicar pantalla de celular, laptops y tablets de manera inalámbrica. ¡Ideal para streaming! VER MÁS",
    video_url: "https://www.youtube.com/shorts/XkebD89H0-4",
    creator: {
      username: "lyccomputetech",
      display_name: "L&C Computer Tech",
      avatar_url:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      is_followed: false,
    },
    likes: 99000,
    comments_count: 1390,
    shareds_count: 390,
    is_liked: false,
    is_bookmarked: false,
    product: {
      id: "anycast-m12",
      title: "AnyCast M12 PLUS",
      price: "89.90",
      whatsapp_link:
        "https://wa.me/51999999999?text=Hola,%20quiero%20comprar%20el%20AnyCast%20M12%20PLUS",
    },
  },
  {
    id: "2",
    title: "Cómo conectar AnyCast a TV",
    description:
      "Instalación fácil y rápida de AnyCast M12 Plus en cualquier TV con puerto HDMI en menos de 2 minutos.",
    video_url: "https://www.youtube.com/watch?v=w1kyBhuXIMg",
    creator: {
      username: "lyccomputetech",
      display_name: "L&C Computer Tech",
      avatar_url:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      is_followed: false,
    },
    likes: 12000,
    comments_count: 340,
    shareds_count: 240,
    is_liked: false,
    is_bookmarked: false,
    product: {
      id: "anycast-m12",
      title: "AnyCast M12 PLUS",
      price: "89.90",
      whatsapp_link:
        "https://wa.me/51999999999?text=Hola,%20quiero%20comprar%20el%20AnyCast%20M12%20PLUS",
    },
  },
  {
    id: "3",
    title: "AnyCast M12 en Monitor",
    description:
      "¿No tienes TV? Conecta tu celular a un monitor clásico de PC usando AnyCast. ¡Trabaja y juega en grande!",
    video_url: "https://www.youtube.com/shorts/L-FW_n2sEa4",
    creator: {
      username: "lyccomputetech",
      display_name: "L&C Computer Tech",
      avatar_url:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      is_followed: false,
    },
    likes: 4500,
    comments_count: 98,
    shareds_count: 78,
    is_liked: false,
    is_bookmarked: false,
    product: {
      id: "anycast-m12",
      title: "AnyCast M12 PLUS",
      price: "89.90",
      whatsapp_link:
        "https://wa.me/51999999999?text=Hola,%20quiero%20comprar%20el%20AnyCast%20M12%20PLUS",
    },
  },
];

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
                className="components-wrapper h-full w-full flex justify-center items-center"
              >
                <div className="video-wrapper h-full w-auto lg:my-4 snap-start snap-always relative flex gap-4 py-4">
                  <div className="wrapper m-auto grid gap-1">
                    <VideoComponent
                      index={index}
                      video={video}
                      videoRefs={videoRefs}
                      onSetMenuOpen={setMenuOpen}
                    />
                    {/*<div className="wrapper-button h-12">*/}
                    {/*  <Button*/}
                    {/*    type="button"*/}
                    {/*    variant="primary"*/}
                    {/*    className="w-full my-1"*/}
                    {/*  >*/}
                    {/*    Registrarse*/}
                    {/*  </Button>*/}
                    {/*</div>*/}
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
