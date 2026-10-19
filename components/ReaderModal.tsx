"use client";

import { useEffect, useState, useRef } from "react";
import { X, Bookmark, Share2, Heart, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Post } from "../lib/types";
import { formatPostDate, getPostCategory, getPostTags } from "../lib/postUtils";

interface ReaderModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  likesCount: number;
  userLiked: boolean;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function ReaderModal({
  post,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  likesCount,
  userLiked,
  onLike,
  onShare,
  onTagClick,
}: ReaderModalProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 0: compact, 1: editorial serif, 2: large serif
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setScrollProgress(0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const docHeight = scrollHeight - clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  if (!isOpen || !post) return null;

  const category = getPostCategory(post);
  const tags = getPostTags(post);
  const initials = (post.username || "Omar")
    .split(/[\s_]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "MO";

  const fontSizes = [
    "text-sm sm:text-base font-sans leading-relaxed",
    "text-base sm:text-lg font-serif leading-relaxed",
    "text-lg sm:text-xl font-serif leading-loose",
  ];

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/60 z-50">
        <div
          className="h-full bg-sage-500 dark:bg-sage-300 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-10 flex justify-center items-start">
        <article className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl bg-card border border-border shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
          
          {/* Sticky Reader Header - Responsive */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-card/95 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sage-500/10 text-sage-700 dark:text-sage-300">
                {category}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime || 4}m read
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Typography Size Toggle */}
              <button
                onClick={() => setFontSizeIndex((prev) => (prev + 1) % 3)}
                className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-mono border border-border text-foreground hover:bg-muted transition-colors"
                title={`Text size: ${["Compact Sans", "Editorial Serif", "Large Serif"][fontSizeIndex]}`}
              >
                Aa
              </button>

              {/* Bookmark inside Reader */}
              <button
                onClick={() => onToggleBookmark(post.id)}
                className={`p-1.5 sm:p-2 rounded-lg border border-border transition-colors ${
                  isBookmarked
                    ? "text-sage-600 dark:text-sage-300 bg-sage-500/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title="Bookmark Story"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </button>

              {/* Share inside Reader */}
              <button
                onClick={() => onShare(post.id)}
                className="p-1.5 sm:p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Share Story"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="px-4 py-6 sm:px-10 sm:py-10">
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.2] mb-5 sm:mb-6">
              {post.title}
            </h1>

            {/* Author Metadata Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-5 mb-6 sm:mb-8 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-sage-600 to-sky-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-inner shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      {post.username || "Omar"}
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-sky-600 dark:text-sky-400">
                      @{post.username || "author"}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    {formatPostDate(post.createdAt)}
                  </p>
                </div>
              </div>

              {/* Appreciate Button */}
              <button
                onClick={() => onLike(post.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  userLiked
                    ? "border-rose-500 text-rose-500 bg-rose-500/10 shadow-sm"
                    : "border-border text-muted-foreground hover:border-sage-500 hover:text-foreground"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${userLiked ? "fill-rose-500" : ""}`} />
                <span>{likesCount}</span>
                <span className="hidden sm:inline">Appreciations</span>
              </button>
            </div>

            {/* Rich Editorial Content */}
            <div
              className={`space-y-5 text-foreground/90 prose prose-slate dark:prose-invert max-w-none ${fontSizes[fontSizeIndex]}`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.description}
              </ReactMarkdown>
            </div>

            {/* Tags Footer */}
            {tags && tags.length > 0 && (
              <div className="mt-8 sm:mt-10 pt-5 border-t border-border flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onClose();
                      onTagClick?.(tag);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-muted text-muted-foreground hover:bg-sage-500/10 hover:text-sage-600 dark:hover:text-sage-300 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
