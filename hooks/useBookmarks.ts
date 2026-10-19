"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bloggin_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setBookmarks(JSON.parse(saved));
      } else {
        // Initial default bookmarked articles matching the prototype
        const defaults = ['art-of-slow-mornings', 'what-is-life'];
        setBookmarks(defaults);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      }
    } catch (e) {
      console.error("Failed to load bookmarks", e);
    } finally {
      setIsLoaded(true);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setBookmarks(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleBookmark = useCallback((id: string): boolean => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("bloggin_bookmarks_updated"));
      } catch (e) {
        console.error("Failed to save bookmarks", e);
      }
      return updated;
    });
    return !bookmarks.includes(id);
  }, [bookmarks]);

  const isBookmarked = useCallback((id: string) => {
    return bookmarks.includes(id);
  }, [bookmarks]);

  return {
    bookmarks,
    isLoaded,
    isBookmarked,
    toggleBookmark,
    bookmarkCount: bookmarks.length,
  };
}
