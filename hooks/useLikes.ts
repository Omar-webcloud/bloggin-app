"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bloggin_likes";

export function useLikes() {
  const [likesData, setLikesData] = useState<Record<string, { count: number; userLiked: boolean }>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLikesData(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load likes", e);
    }

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setLikesData(JSON.parse(saved));
      } catch {}
    };

    window.addEventListener("bloggin_likes_updated", handleUpdate);
    return () => window.removeEventListener("bloggin_likes_updated", handleUpdate);
  }, []);

  const getLikes = useCallback((id: string, defaultLikes: number = 0) => {
    if (likesData[id]) {
      return likesData[id];
    }
    return { count: defaultLikes, userLiked: false };
  }, [likesData]);

  const likePost = useCallback((id: string, defaultLikes: number = 0) => {
    setLikesData((prev) => {
      const current = prev[id] || { count: defaultLikes, userLiked: false };
      const updated = {
        count: current.userLiked ? Math.max(0, current.count - 1) : current.count + 1,
        userLiked: !current.userLiked,
      };
      const nextState = { ...prev, [id]: updated };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        window.dispatchEvent(new Event("bloggin_likes_updated"));
      } catch (e) {
        console.error("Failed to save likes", e);
      }
      return nextState;
    });
  }, []);

  return {
    getLikes,
    likePost,
  };
}
