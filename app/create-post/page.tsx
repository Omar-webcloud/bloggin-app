"use client";

import { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import useAuth from "../../hooks/useAuth";
import MarkdownToolbar from "../../components/MarkdownToolbar";
import { EDITABLE_CATEGORIES } from "../../lib/types";
import { calculateReadTime } from "../../lib/postUtils";
import { PenTool } from "lucide-react";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Lifestyle");
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, loading } = useAuth();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const finalTags = parsedTags.length > 0 ? parsedTags : [category];
      const readTime = calculateReadTime(description);

      await addDoc(collection(db, "posts"), {
        title: title.trim(),
        description: description.trim(),
        category,
        tags: finalTags,
        readTime,
        likes: 1,
        userId: user.uid,
        username: user.displayName || user.email?.split("@")[0] || "Anonymous",
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to publish post.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <BackButton />
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm mt-4">
        
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div className="p-2 rounded-xl bg-sage-500/10 text-sage-600 dark:text-sage-300">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Write a New Story</h1>
            <p className="text-xs text-muted-foreground">Share your ideas, reflections, or guides with the community</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Story Title
            </label>
            <input
              type="text"
              placeholder="e.g., A Rainy Afternoon in the Hills & What It Taught Me"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sage-500/40 focus:border-sage-500 focus:outline-none transition-all"
            />
          </div>

          {/* Category & Tags Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sage-500/40 focus:border-sage-500 focus:outline-none transition-all cursor-pointer"
              >
                {EDITABLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="mindfulness, habits, journal"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sage-500/40 focus:border-sage-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Markdown Content */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Story Content (Markdown supported)
            </label>
            <MarkdownToolbar textareaRef={textareaRef} value={description} onChange={setDescription} />
            <textarea
              ref={textareaRef}
              placeholder="Write your story here... Markdown formatting like **bold**, *italic*, quotes, and lists are supported."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm leading-relaxed focus:ring-2 focus:ring-sage-500/40 focus:border-sage-500 focus:outline-none transition-all min-h-[240px] resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
