"use client";

import { useState, useEffect } from "react";
import { Bookmark, Share2, Heart, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Post } from "../lib/types";
import { formatPostDate, getPostCategory, getPostTags } from "../lib/postUtils";
import { useBookmarks } from "../hooks/useBookmarks";
import { useLikes } from "../hooks/useLikes";
import ShareModal from "./ShareModal";
import BackButton from "./BackButton";

interface PostDetailViewProps {
  post: Post;
}

export default function PostDetailView({ post }: PostDetailViewProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { getLikes, likePost } = useLikes();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSizeIndex, setFontSizeIndex] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);

  const category = getPostCategory(post);
  const tags = getPostTags(post);
  const likesInfo = getLikes(post.id, post.likes);

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

  // Window scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-slate-800/40 z-30">
        <div
          className="h-full bg-sage-500 dark:bg-sage-300 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-8 relative z-10">
        <BackButton />

        <article className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl bg-card border border-border shadow-sm overflow-hidden p-4 sm:p-10">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sage-500/10 text-sage-700 dark:text-sage-300">
                {category}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime || 4} min read
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setFontSizeIndex((prev) => (prev + 1) % 3)}
                className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-mono border border-border text-foreground hover:bg-muted transition-colors"
                title={`Text size: ${["Compact Sans", "Editorial Serif", "Large Serif"][fontSizeIndex]}`}
              >
                Aa
              </button>

              <button
                onClick={() => toggleBookmark(post.id)}
                className={`p-1.5 sm:p-2 rounded-lg border border-border transition-colors ${
                  isBookmarked(post.id)
                    ? "text-sage-600 dark:text-sage-300 bg-sage-500/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title="Bookmark Story"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked(post.id) ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-1.5 sm:p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Share Story"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.2] mb-5 sm:mb-6">
            {post.title}
          </h1>

          {/* Author metadata bar */}
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

            {/* Appreciate button */}
            <button
              onClick={() => likePost(post.id, post.likes)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                likesInfo.userLiked
                  ? "border-rose-500 text-rose-500 bg-rose-500/10 shadow-sm"
                  : "border-border text-muted-foreground hover:border-sage-500 hover:text-foreground"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${likesInfo.userLiked ? "fill-rose-500" : ""}`} />
              <span>{likesInfo.count}</span>
              <span className="hidden sm:inline">Appreciations</span>
            </button>
          </div>

          {/* Rich Markdown Article Content */}
          <div
            className={`space-y-5 text-foreground/90 prose prose-slate dark:prose-invert max-w-none ${fontSizes[fontSizeIndex]}`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.description}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-8 sm:mt-10 pt-5 border-t border-border flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-muted text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Share Trigger */}
          <div className="mt-8 pt-6 border-t border-border flex justify-end">
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Story</span>
            </button>
          </div>
        </article>
      </main>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={post.id}
      />
    </>
  );
}
