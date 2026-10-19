"use client";

import Link from "next/link";
import { PenLine, BookOpen, ArrowRight } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Post } from "../lib/types";

interface HeroSectionProps {
  totalPosts: number;
  onSelectPost: (post: Post) => void;
  featuredPost?: Post;
}

export default function HeroSection({
  totalPosts,
  onSelectPost,
  featuredPost,
}: HeroSectionProps) {
  const { user } = useAuth();

  const featured = featuredPost || {
    id: "art-of-slow-mornings",
    title: "The Art of Slow Mornings in a Hyper-Connected World",
    category: "Lifestyle",
    readTime: 4,
    description:
      "Before reaching for your phone at 7 AM and drowning in notifications, try giving your mind twenty quiet minutes with sunlight, tea, and a notebook.",
    username: "Md_Omar_Faruk_Chowdhury",
    userId: "omar",
    likes: 128,
  };

  return (
    <section className="relative rounded-2xl sm:rounded-3xl bg-card border border-border/80 p-6 sm:p-10 lg:p-12 mb-8 sm:mb-10 shadow-sm transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Left Column: Literary Editorial Statement & CTAs */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
          
          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-serif tracking-tight text-foreground leading-[1.14]">
            A quiet corner of the web <br className="hidden sm:inline" />
            <span className="italic font-normal text-sage-700 dark:text-sage-300">
              for thoughtful writing.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed font-sans">
            Personal essays, travel journals, and everyday observations written by real people. Free of algorithms, distractions, and loud feeds.
          </p>

          {/* Actions & Count */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={user ? "/create-post" : "/login"}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 shadow-sm hover:shadow transition-all active:scale-95"
            >
              <PenLine className="w-4 h-4" />
              <span>Start Writing</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-600 dark:bg-sage-300"></span>
                <span>{totalPosts} Pieces Published</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Featured Piece */}
        <div className="lg:col-span-5 w-full">
          <div
            onClick={() => onSelectPost(featured as Post)}
            className="cursor-pointer group p-5 sm:p-6 rounded-2xl bg-muted/40 hover:bg-muted/70 border border-border hover:border-sage-500/40 dark:hover:border-sage-300/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sage-700 dark:text-sage-300 uppercase tracking-wider font-mono">
                <BookOpen className="w-3.5 h-3.5" />
                Featured Piece
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {featured.readTime || 4} min read
              </span>
            </div>

            <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground group-hover:text-sage-700 dark:group-hover:text-sage-300 leading-snug mb-2 transition-colors">
              {featured.title}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 font-sans">
              {featured.description.slice(0, 160)}...
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border/80 text-xs">
              <span className="text-sky-600 dark:text-sky-400 font-medium truncate max-w-[180px]">
                By {featured.username || "Omar"}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-sage-600 dark:text-sage-300 group-hover:translate-x-0.5 transition-transform">
                Read story <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
