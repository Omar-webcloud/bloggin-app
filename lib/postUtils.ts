import { Post } from "./types";

export function calculateReadTime(text: string = ""): number {
  if (!text) return 1;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 180));
}

export function formatPostDate(timestamp: any): string {
  if (!timestamp) return new Date().toLocaleString("en-US");
  if (typeof timestamp === "object" && "seconds" in timestamp) {
    return new Date(timestamp.seconds * 1000).toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString("en-US");
  }
  return String(timestamp);
}

export function getPostCategory(post: Partial<Post>): string {
  if (post.category && post.category.trim()) return post.category.trim();
  return "Reflections";
}

export function getPostTags(post: Partial<Post>): string[] {
  if (Array.isArray(post.tags) && post.tags.length > 0) {
    return post.tags.filter(Boolean);
  }
  const category = getPostCategory(post);
  return [category, "Writing"];
}

export function normalizePost(raw: any, id: string): Post {
  const category = raw.category || "Reflections";
  const tags = Array.isArray(raw.tags) && raw.tags.length > 0 
    ? raw.tags 
    : [category];
  const readTime = raw.readTime || calculateReadTime(raw.description || "");

  return {
    id,
    title: raw.title || "Untitled Story",
    description: raw.description || "",
    userId: raw.userId || "",
    username: raw.username || "Anonymous Author",
    createdAt: raw.createdAt,
    category,
    tags,
    readTime,
    likes: typeof raw.likes === "number" ? raw.likes : 1,
  };
}
