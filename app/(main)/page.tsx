'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Heart,
  MessageCircle,
  Bookmark,
  Menu,
  Search,
  X,
  Send,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  Check,
  Plus
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';

interface Comment {
  id: string;
  username: string;
  avatar_url?: string;
  content: string;
  created_at: string;
  likes: number;
}

interface Video {
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
    id: '1',
    title: 'AnyCast M12 PLUS',
    description: 'Dispositivo para duplicar pantalla de celular, laptops y tablets de manera inalámbrica. ¡Ideal para streaming! VER MÁS',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-showing-a-map-41589-large.mp4',
    creator: {
      username: 'lyccomputetech',
      display_name: 'L&C Computer Tech',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      is_followed: false,
    },
    likes: 99000,
    comments_count: 1390,
    is_liked: false,
    is_bookmarked: false,
    product: {
      id: 'anycast-m12',
      title: 'AnyCast M12 PLUS',
      price: '89.90',
      whatsapp_link: 'https://wa.me/51999999999?text=Hola,%20quiero%20comprar%20el%20AnyCast%20M12%20PLUS'
    }
  },
  {
    id: '2',
    title: 'Cómo conectar AnyCast a TV',
    description: 'Instalación fácil y rápida de AnyCast M12 Plus en cualquier TV con puerto HDMI en menos de 2 minutos.',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-smartphone-close-up-40439-large.mp4',
    creator: {
      username: 'lyccomputetech',
      display_name: 'L&C Computer Tech',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      is_followed: false,
    },
    likes: 12000,
    comments_count: 340,
    is_liked: false,
    is_bookmarked: false,
    product: {
      id: 'anycast-m12',
      title: 'AnyCast M12 PLUS',
      price: '89.90',
      whatsapp_link: 'https://wa.me/51999999999?text=Hola,%20quiero%20comprar%20el%20AnyCast%20M12%20PLUS'
    }
  },
  {
    id: '3',
    title: 'AnyCast M12 en Monitor',
    description: '¿No tienes TV? Conecta tu celular a un monitor clásico de PC usando AnyCast. ¡Trabaja y juega en grande!',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-computer-keyboard-close-up-41584-large.mp4',
    creator: {
      username: 'lyccomputetech',
      display_name: 'L&C Computer Tech',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      is_followed: false,
    },
    likes: 4500,
    comments_count: 98,
    is_liked: false,
    is_bookmarked: false,
    product: {
      id: 'anycast-m12',
      title: 'AnyCast M12 PLUS',
      price: '89.90',
      whatsapp_link: 'https://wa.me/51999999999?text=Hola,%20quiero%20comprar%20el%20AnyCast%20M12%20PLUS'
    }
  }
];

const MOCK_COMMENTS: Record<string, Comment[]> = {
  '1': [
    { id: 'c1', username: 'carlos_tech', content: '¿Viene con manual en español? Funciona muy bien.', created_at: '2h', likes: 24 },
    { id: 'c2', username: 'sofia.g', content: '¿Es compatible con iPhone 15? Necesito uno así.', created_at: '4h', likes: 12 },
    { id: 'c3', username: 'pedro_m', content: '¡Excelente producto! Me llegó súper rápido por WhatsApp.', created_at: '1d', likes: 5 },
  ],
  '2': [
    { id: 'c4', username: 'lucas_d', content: 'Súper bien explicado, gracias por el video.', created_at: '5h', likes: 8 },
    { id: 'c5', username: 'maria_luz', content: '¿Venden al por mayor para tiendas?', created_at: '1d', likes: 18 },
  ],
  '3': [
    { id: 'c6', username: 'juan_perez', content: '¿Qué resolución soporta en monitor?', created_at: '1h', likes: 2 },
  ]
};

export default function FeedPage() {
  const { theme, setTheme } = useTheme();
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Modals & Panels State
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load comments when drawer opens
  const openComments = (videoId: string) => {
    setComments(MOCK_COMMENTS[videoId] || []);
    setCommentsOpen(true);
  };

  // Add new comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      username: 'usuario_demo',
      content: newCommentText,
      created_at: 'Ahora',
      likes: 0
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');

    // Update comment count
    const updatedVideos = [...videos];
    updatedVideos[currentVideoIndex].comments_count += 1;
    setVideos(updatedVideos);
  };

  // Toggle Like
  const toggleLike = (index: number) => {
    const updatedVideos = [...videos];
    const video = updatedVideos[index];
    if (video.is_liked) {
      video.likes -= 1;
      video.is_liked = false;
    } else {
      video.likes += 1;
      video.is_liked = true;
    }
    setVideos(updatedVideos);
  };

  // Toggle Bookmark
  const toggleBookmark = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos[index].is_bookmarked = !updatedVideos[index].is_bookmarked;
    setVideos(updatedVideos);
  };

  // Toggle Follow
  const toggleFollow = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos[index].creator.is_followed = !updatedVideos[index].creator.is_followed;
    setVideos(updatedVideos);
  };

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
        }
    );

    // Filter out null refs and observe
    const currentRefs = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    currentRefs.forEach((ref) => observer.observe(ref));

    return () => {
      currentRefs.forEach((ref) => observer.unobserve(ref));
    };
  }, [videos]);

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
      <div className="h-full w-full bg-black lg:bg-background relative flex justify-center items-center transition-colors duration-300">
        {/* Home Feed Container */}
        <div
            ref={containerRef}
            className="h-full w-full max-w-[480px] lg:h-[calc(100vh-6rem)] lg:my-4 lg:rounded-3xl lg:border lg:border-border/40 lg:shadow-2xl bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-none relative"
        >
          {/* Transparent Header */}
          <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/60 to-transparent">
            <button
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex gap-4 text-white font-semibold text-lg">
              <span className="border-b-2 border-accent pb-1 cursor-pointer">Para ti</span>
              <span className="text-white/60 hover:text-white pb-1 cursor-pointer">Siguiendo</span>
            </div>

            <button className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors">
              <Search className="w-6 h-6" />
            </button>
          </header>

          {/* Video Snapping List */}
          {videos.map((video, index) => {
            const isActive = index === currentVideoIndex;

            return (
                <div
                    key={video.id}
                    className="h-full w-full snap-start snap-always relative flex items-center justify-center bg-black"
                >
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

                  {/* Right Side Overlay (Social & Actions) */}
                  <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-6">
                    {/* Creator Avatar & Follow Button */}
                    <div className="relative mb-2">
                      <Link href={`/profile`}>
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg bg-neutral-800 flex items-center justify-center">
                          <Avatar
                              src={video.creator.avatar_url}
                              fallback={video.creator.username}
                              size="md"
                          />
                        </div>
                      </Link>
                      <button
                          onClick={() => toggleFollow(index)}
                          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white border border-black shadow-md transition-all duration-300 ${
                              video.creator.is_followed
                                  ? 'bg-neutral-600 rotate-45'
                                  : 'bg-accent hover:scale-110'
                          }`}
                      >
                        {video.creator.is_followed ? <Check className="w-3 h-3" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Like Button */}
                    <button
                        onClick={() => toggleLike(index)}
                        className="flex flex-col items-center gap-1 group text-white active:scale-95 transition-transform"
                    >
                      <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors">
                        <Heart
                            className={`w-6 h-6 transition-colors duration-300 ${
                                video.is_liked
                                    ? 'fill-accent text-accent animate-pulse-glow'
                                    : 'text-white group-hover:text-accent'
                            }`}
                        />
                      </div>
                      <span className="text-xs font-semibold drop-shadow-md">
                    {formatNumber(video.likes)}
                  </span>
                    </button>

                    {/* Comment Button */}
                    <button
                        onClick={() => openComments(video.id)}
                        className="flex flex-col items-center gap-1 group text-white active:scale-95 transition-transform"
                    >
                      <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors">
                        <MessageCircle className="w-6 h-6 group-hover:text-accent transition-colors" />
                      </div>
                      <span className="text-xs font-semibold drop-shadow-md">
                    {formatNumber(video.comments_count)}
                  </span>
                    </button>

                    {/* Bookmark Button */}
                    <button
                        onClick={() => toggleBookmark(index)}
                        className="flex flex-col items-center gap-1 group text-white active:scale-95 transition-transform"
                    >
                      <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors">
                        <Bookmark
                            className={`w-6 h-6 transition-colors duration-300 ${
                                video.is_bookmarked
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-white group-hover:text-amber-500'
                            }`}
                        />
                      </div>
                      <span className="text-xs font-semibold drop-shadow-md">Guardar</span>
                    </button>
                  </div>

                  {/* Bottom Overlay (Info details & WhatsApp CTA) */}
                  <div className="absolute left-0 right-0 bottom-0 z-10 px-4 pb-20 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                    <div className="space-y-4 max-w-[85%]">
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
                      <p className="text-sm text-neutral-200 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>

                      {/* WhatsApp Purchase CTA */}
                      <a
                          href={video.product.whatsapp_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center py-3.5 px-6 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/25 hover:shadow-accent/40"
                          style={{ background: 'var(--gradient-brand)' }}
                      >
                        COMPRAR POR WHATSAPP
                      </a>
                    </div>
                  </div>
                </div>
            );
          })}
        </div>

        {/* Hamburger / Settings Left Drawer (TikTok-style menu with Theme switches) */}
        {menuOpen && (
            <div className="fixed inset-0 z-50 flex">
              {/* Backdrop */}
              <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                  onClick={() => setMenuOpen(false)}
              />

              {/* Drawer content */}
              <div className="relative w-80 max-w-[85%] h-full bg-card border-r border-border p-6 flex flex-col justify-between shadow-2xl animate-fade-in z-10">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Ajustes</h2>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="p-1 rounded-full hover:bg-card-hover text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Theme Settings Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
                      Tema de la aplicación
                    </label>
                    <div className="space-y-1.5">
                      {[
                        { value: 'light', label: 'Modo Claro', icon: Sun },
                        { value: 'dark', label: 'Modo Oscuro', icon: Moon },
                        { value: 'system', label: 'Sistema', icon: Laptop }
                      ].map((t) => {
                        const isSelected = theme === t.value;
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.value}
                                onClick={() => setTheme(t.value as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                                    isSelected
                                        ? 'bg-accent/10 border-accent/40 text-accent shadow-sm'
                                        : 'bg-card-hover/20 border-border/50 text-muted-foreground hover:bg-card-hover hover:text-foreground'
                                }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span>{t.label}</span>
                              {isSelected && <Check className="w-4 h-4 ml-auto" />}
                            </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick links info */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm py-2 text-muted-foreground hover:text-foreground cursor-pointer">
                      <span>Acerca de Sellbox</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 text-muted-foreground hover:text-foreground cursor-pointer">
                      <span>Términos y condiciones</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Version */}
                <div className="text-xs text-muted text-center pt-4 border-t border-border">
                  Sellbox v1.0.0
                </div>
              </div>
            </div>
        )}

        {/* Slide-up Comments Bottom Drawer */}
        {commentsOpen && (
            <div className="fixed inset-0 z-50 flex flex-col justify-end">
              {/* Backdrop */}
              <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => setCommentsOpen(false)}
              />

              {/* Drawer Sheet */}
              <div className="relative w-full max-w-[480px] mx-auto h-[60vh] bg-card border-t border-border rounded-t-3xl flex flex-col z-10 animate-slide-up shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="font-bold text-foreground">
                {comments.length} comentarios
              </span>
                  <button
                      onClick={() => setCommentsOpen(false)}
                      className="p-1 rounded-full hover:bg-card-hover text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Comments scrollable list */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {comments.length > 0 ? (
                      comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center shrink-0">
                              <Avatar
                                  src={comment.avatar_url}
                                  fallback={comment.username}
                                  size="sm"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          @{comment.username}
                        </span>
                                <button className="flex items-center gap-1 text-xs text-muted hover:text-accent">
                                  <Heart className="w-3.5 h-3.5" />
                                  <span>{comment.likes}</span>
                                </button>
                              </div>
                              <p className="text-sm text-foreground/90 font-normal leading-relaxed">
                                {comment.content}
                              </p>
                              <span className="text-[10px] text-muted block">
                        {comment.created_at}
                      </span>
                            </div>
                          </div>
                      ))
                  ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-muted gap-2 py-8">
                        <MessageCircle className="w-10 h-10 text-muted/40" />
                        <p className="text-sm">Sé el primero en comentar</p>
                      </div>
                  )}
                </div>

                {/* Input area */}
                <form
                    onSubmit={handleAddComment}
                    className="p-4 border-t border-border bg-card flex items-center gap-3"
                >
                  <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Añadir comentario..."
                      className="flex-1 bg-card-hover/30 border border-border rounded-full py-2.5 px-4 text-sm text-foreground placeholder-muted outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all duration-200"
                  />
                  <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-40 disabled:scale-100 transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
                      style={{ background: 'var(--gradient-brand)' }}
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}
