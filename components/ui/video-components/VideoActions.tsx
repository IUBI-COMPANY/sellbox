import { useState } from "react";
import {
  Bookmark,
  Check,
  Heart,
  MessageCircle,
  Plus,
  Send,
  Share2Icon,
  X,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Link from "next/link";
import { Video } from "@/app/data-list/InitialVideos";

interface Comment {
  id: string;
  username: string;
  avatar_url?: string;
  content: string;
  created_at: string;
  likes: number;
}

const MOCK_COMMENTS: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      username: "carlos_tech",
      content: "¿Viene con manual en español? Funciona muy bien.",
      created_at: "2h",
      likes: 24,
    },
    {
      id: "c2",
      username: "sofia.g",
      content: "¿Es compatible con iPhone 15? Necesito uno así.",
      created_at: "4h",
      likes: 12,
    },
    {
      id: "c3",
      username: "pedro_m",
      content: "¡Excelente producto! Me llegó súper rápido por WhatsApp.",
      created_at: "1d",
      likes: 5,
    },
  ],
  "2": [
    {
      id: "c4",
      username: "lucas_d",
      content: "Súper bien explicado, gracias por el video.",
      created_at: "5h",
      likes: 8,
    },
    {
      id: "c5",
      username: "maria_luz",
      content: "¿Venden al por mayor para tiendas?",
      created_at: "1d",
      likes: 18,
    },
  ],
  "3": [
    {
      id: "c6",
      username: "juan_perez",
      content: "¿Qué resolución soporta en monitor?",
      created_at: "1h",
      likes: 2,
    },
  ],
};

interface Props {
  index: number;
  currentVideoIndex: number;
  video: Video;
  videos: Video[];
  onSetVideos: (videos: Video[]) => void;
}

export default function VideoActions({
  index,
  currentVideoIndex,
  video,
  videos,
  onSetVideos,
}: Props) {
  // Modals & Panels State
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");

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
      username: "usuario_demo",
      content: newCommentText,
      created_at: "Ahora",
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");

    // Update comment count
    const updatedVideos = [...videos];
    updatedVideos[currentVideoIndex].comments_count += 1;
    onSetVideos(updatedVideos);
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
    onSetVideos(updatedVideos);
  };

  // Toggle Bookmark
  const toggleBookmark = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos[index].is_bookmarked = !updatedVideos[index].is_bookmarked;
    onSetVideos(updatedVideos);
  };

  // Toggle Follow
  const toggleFollow = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos[index].creator.is_followed =
      !updatedVideos[index].creator.is_followed;
    onSetVideos(updatedVideos);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <>
      {/* Right Side Overlay (Social & Actions) */}
      <section className="actions-wrapper relative flex flex-col items-center justify-end gap-4 pb-3">
        {/* Creator Avatar & Follow Button */}
        <div className="relative mb-2">
          <Link href={`/profile`}>
            <div className="w-13 h-13 rounded-full overflow-hidden flex items-center justify-center">
              <Avatar
                src={video.creator.avatar_url}
                fallback={video.creator.username}
                size="md"
                className="w-full h-full"
              />
            </div>
          </Link>
          <button
            onClick={() => toggleFollow(index)}
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white border border-black shadow-md transition-all duration-300 ${
              video.creator.is_followed
                ? "bg-neutral-600 rotate-45"
                : "bg-accent hover:scale-110"
            }`}
          >
            {video.creator.is_followed ? (
              <Check className="w-3 h-3" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Like Button */}
        <button
          onClick={() => toggleLike(index)}
          className={`flex flex-col items-center gap-1 group active:scale-95 transition-transform`}
        >
          <div className="w-11 h-11 rounded-full bg-gray-300/40 backdrop-blur-md flex items-center justify-center">
            <Heart
              className={`w-6 h-6 transition-colors duration-300 ${
                video.is_liked
                  ? "fill-accent text-accent animate-pulse-glow"
                  : "group-hover:text-accent"
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
          className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
        >
          <div className="w-11 h-11 rounded-full bg-gray-300/40 backdrop-blur-md flex items-center justify-center">
            <MessageCircle className="w-6 h-6 group-hover:text-accent transition-colors" />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">
            {formatNumber(video.comments_count)}
          </span>
        </button>

        {/* Shared Button */}
        <button className="flex flex-col items-center gap-1 group active:scale-95 transition-transform">
          <div className="w-11 h-11 rounded-full bg-gray-300/40 backdrop-blur-md flex items-center justify-center">
            <Share2Icon className="w-6 h-6 group-hover:text-accent transition-colors" />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">
            {formatNumber(video.shareds_count)}
          </span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleBookmark(index)}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
        >
          <div className="w-11 h-11 rounded-full bg-gray-300/40 backdrop-blur-md flex items-center justify-center">
            <Bookmark
              className={`w-6 h-6 transition-colors duration-300 ${
                video.is_bookmarked
                  ? "fill-amber-500 text-amber-500"
                  : "group-hover:text-amber-500"
              }`}
            />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">Guardar</span>
        </button>
      </section>

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
                style={{ background: "var(--gradient-brand)" }}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
