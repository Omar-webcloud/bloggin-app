"use client";

import { useState } from "react";
import { Clock, MoreVertical, Heart, Bookmark, Share2, ArrowRight, BookOpen, Edit, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Post } from "../lib/types";
import { formatPostDate, getPostCategory, getPostTags } from "../lib/postUtils";

interface BlogCardProps {
  post: Post;
  currentUserId?: string;
  isBookmarked: boolean;
  likesCount: number;
  userLiked: boolean;
  onRead: (post: Post) => void;
  onBookmark: (postId: string) => void;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onTagClick?: (tag: string) => void;
  layoutMode?: "grid" | "list";
}

export default function BlogCard({
  post,
  currentUserId,
  isBookmarked,
  likesCount,
  userLiked,
  onRead,
  onBookmark,
  onLike,
  onShare,
  onEdit,
  onDelete,
  onTagClick,
  layoutMode = "grid",
}: BlogCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = currentUserId && post.userId === currentUserId;
  const category = getPostCategory(post);
  const tags = getPostTags(post);

  return (
    <article
      className={`blog-card group relative flex flex-col justify-between rounded-2xl bg-card border border-border p-4 sm:p-6 shadow-sm ${
        layoutMode === "list" ? "sm:p-8" : ""
      }`}
    >
      <div>
        {/* Card Top Meta: Category + Read Time + Context Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium tracking-wide bg-sage-500/10 text-sage-700 dark:bg-sage-300/15 dark:text-sage-300">
              {category}
            </span>
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime || 3}m read
            </span>
          </div>

          {/* 3-Dots Context Menu */}
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Post options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-card border border-border shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onRead(post);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    Read Full Story
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onBookmark(post.id);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        isBookmarked ? "text-sage-500 fill-sage-500" : "text-muted-foreground"
                      }`}
                    />
                    {isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                  </button>
                  {isOwner && onEdit && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(post.id);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-foreground hover:bg-muted flex items-center gap-2"
                    >
                      <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                      Edit Story
                    </button>
                  )}
                  {isOwner && onDelete && (
                    <>
                      <div className="my-1 border-t border-border" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onDelete(post.id);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Story
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Story Title with Editorial Serif Font */}
        <h2
          onClick={() => onRead(post)}
          className="font-serif text-lg sm:text-[21px] font-bold tracking-tight text-foreground group-hover:text-sage-700 dark:group-hover:text-sage-300 leading-snug cursor-pointer transition-colors mb-2 line-clamp-2"
        >
          {post.title}
        </h2>

        {/* Author Byline & Date */}
        <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 font-medium mb-3">
          <span className="truncate max-w-[150px] sm:max-w-[200px]">By {post.username || "Anonymous"}</span>
          <span className="text-muted-foreground/50">•</span>
          <time className="whitespace-nowrap text-muted-foreground">
            {formatPostDate(post.createdAt)}
          </time>
        </div>

        {/* Prose Excerpt with soft fade */}
        <div
          onClick={() => onRead(post)}
          className="text-sm text-muted-foreground leading-relaxed line-clamp-3 excerpt-mask cursor-pointer mb-3.5 prose prose-sm dark:prose-invert max-w-none font-sans"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.description}
          </ReactMarkdown>
        </div>

        {/* Tags Chips */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-muted text-muted-foreground hover:text-sage-600 dark:hover:text-sage-300 hover:bg-sage-500/10 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Responsive on all screen widths */}
      <div className="pt-3.5 border-t border-border flex items-center justify-between gap-1.5 sm:gap-2 mt-auto">
        <button
          onClick={() => onRead(post)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 shadow-sm transition-all group/btn shrink-0"
        >
          <span>Read Story</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Like / Appreciate Button */}
          <button
            onClick={() => onLike(post.id)}
            className={`inline-flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-lg text-xs font-medium transition-colors ${
              userLiked
                ? "text-rose-500 bg-rose-500/10"
                : "text-muted-foreground hover:text-rose-500 hover:bg-muted"
            }`}
            title="Appreciate story"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${userLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{likesCount}</span>
          </button>

          {/* Quick Bookmark Toggle */}
          <button
            onClick={() => onBookmark(post.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? "text-sage-600 dark:text-sage-300 bg-sage-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title={isBookmarked ? "Bookmarked" : "Save for later"}
          >
            <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? "fill-current" : ""}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare(post.id)}
            className="inline-flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-medium text-sage-700 dark:text-sage-300 hover:bg-sage-500/10 transition-colors"
            title="Share story"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </article>
  );
}
