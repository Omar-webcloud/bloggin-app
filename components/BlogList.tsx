"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import useAuth from "../hooks/useAuth";
import { useBookmarks } from "../hooks/useBookmarks";
import { useLikes } from "../hooks/useLikes";
import { Post, Category, CATEGORIES, SortOption, LayoutMode } from "../lib/types";
import { normalizePost, getPostCategory, getPostTags } from "../lib/postUtils";
import { samplePosts } from "../lib/samplePosts";

import HeroSection from "./HeroSection";
import FilterBar from "./FilterBar";
import BlogCard from "./BlogCard";
import ReaderModal from "./ReaderModal";
import ConfirmationModal from "./ConfirmationModal";
import ShareModal from "./ShareModal";
import { FileText, RotateCcw } from "lucide-react";

export default function BlogList() {
  const { user } = useAuth();
  const router = useRouter();
  const { isBookmarked, toggleBookmark, bookmarks } = useBookmarks();
  const { getLikes, likePost } = useLikes();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & layout state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Modals state
  const [readerPost, setReaderPost] = useState<Post | null>(null);
  const [postToDeleteId, setPostToDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const firestorePosts = snapshot.docs.map((docSnap) =>
          normalizePost(docSnap.data(), docSnap.id)
        );

        if (firestorePosts.length > 0) {
          // Merge firestore posts with sample posts that are not duplicated
          const existingIds = new Set(firestorePosts.map((p) => p.id));
          const uniqueSample = samplePosts.filter((sp) => !existingIds.has(sp.id));
          setPosts([...firestorePosts, ...uniqueSample]);
        } else {
          setPosts(samplePosts);
        }
      } catch (err) {
        console.warn("Could not load from Firestore, using curated posts:", err);
        setPosts(samplePosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Keyboard shortcut 'N' to create new post
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;
      if (e.key.toLowerCase() === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        router.push(user ? "/create-post" : "/login");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [user, router]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      All: posts.length,
      Lifestyle: 0,
      Reflections: 0,
      Travel: 0,
      Creativity: 0,
      "Food & Culture": 0,
      "Tech & Ideas": 0,
      Saved: 0,
    };

    posts.forEach((p) => {
      const cat = getPostCategory(p) as Category;
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      }
      if (isBookmarked(p.id)) {
        counts.Saved += 1;
      }
    });

    return counts;
  }, [posts, isBookmarked]);

  // Filter & sort
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return posts
      .filter((post) => {
        // Category check
        if (activeCategory === "Saved") {
          if (!isBookmarked(post.id)) return false;
        } else if (activeCategory !== "All") {
          if (getPostCategory(post) !== activeCategory) return false;
        }

        // Search check
        if (q) {
          const titleMatch = post.title.toLowerCase().includes(q);
          const descMatch = post.description.toLowerCase().includes(q);
          const authorMatch = (post.username || "").toLowerCase().includes(q);
          const catMatch = getPostCategory(post).toLowerCase().includes(q);
          const tagsMatch = getPostTags(post).some((t) => t.toLowerCase().includes(q));
          if (!titleMatch && !descMatch && !authorMatch && !catMatch && !tagsMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        }
        if (sortBy === "oldest") {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return aTime - bTime;
        }
        if (sortBy === "popular") {
          const aLikes = getLikes(a.id, a.likes).count;
          const bLikes = getLikes(b.id, b.likes).count;
          return bLikes - aLikes;
        }
        if (sortBy === "quick") {
          return (a.readTime || 3) - (b.readTime || 3);
        }
        return 0;
      });
  }, [posts, activeCategory, searchQuery, sortBy, isBookmarked, getLikes]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Reset Filters
  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Delete Post
  const confirmDelete = async () => {
    if (!postToDeleteId) return;
    try {
      await deleteDoc(doc(db, "posts", postToDeleteId));
      setPosts((prev) => prev.filter((p) => p.id !== postToDeleteId));
      setShowDeleteModal(false);
      setPostToDeleteId(null);
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <>
      {/* Editorial Hero Section */}
      <HeroSection
        totalPosts={posts.length}
        onSelectPost={(post) => setReaderPost(post)}
        featuredPost={posts[0]}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(sort) => setSortBy(sort)}
        layoutMode={layoutMode}
        onLayoutChange={(mode) => setLayoutMode(mode)}
        categoryCounts={categoryCounts}
      />

      {/* Posts Section */}
      <section>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-l-sage-500" />
            <p className="text-xs font-mono text-muted-foreground animate-pulse">
              Curating stories for you...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              No matching articles found
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {activeCategory === "Saved"
                ? "You haven't bookmarked any stories yet. Explore articles and click the bookmark icon to save them here."
                : "We couldn't find any stories matching your current search or category filters."}
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-sage-600 dark:bg-sage-300 text-white dark:text-slate-950 hover:opacity-90 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          /* Blog Grid or List */
          <div
            className={
              layoutMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "grid grid-cols-1 gap-5 max-w-3xl mx-auto"
            }
          >
            {currentPosts.map((post) => {
              const likesInfo = getLikes(post.id, post.likes);
              return (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.uid}
                  isBookmarked={isBookmarked(post.id)}
                  likesCount={likesInfo.count}
                  userLiked={likesInfo.userLiked}
                  onRead={(p) => setReaderPost(p)}
                  onBookmark={(id) => toggleBookmark(id)}
                  onLike={(id) => likePost(id, post.likes)}
                  onShare={(id) => {
                    setSharePostId(id);
                    setShowShareModal(true);
                  }}
                  onEdit={(id) => router.push(`/edit-post/${id}`)}
                  onDelete={(id) => {
                    setPostToDeleteId(id);
                    setShowDeleteModal(true);
                  }}
                  onTagClick={(tag) => {
                    setSearchQuery(tag);
                    setCurrentPage(1);
                  }}
                  layoutMode={layoutMode}
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs sm:text-sm text-foreground shadow-sm"
            >
              Previous
            </button>
            <span className="text-xs sm:text-sm font-mono text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs sm:text-sm text-foreground shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Reader Modal */}
      {readerPost && (
        <ReaderModal
          post={readerPost}
          isOpen={Boolean(readerPost)}
          onClose={() => setReaderPost(null)}
          isBookmarked={isBookmarked(readerPost.id)}
          onToggleBookmark={(id) => toggleBookmark(id)}
          likesCount={getLikes(readerPost.id, readerPost.likes).count}
          userLiked={getLikes(readerPost.id, readerPost.likes).userLiked}
          onLike={(id) => likePost(id, readerPost.likes)}
          onShare={(id) => {
            setSharePostId(id);
            setShowShareModal(true);
          }}
          onTagClick={(tag) => {
            setSearchQuery(tag);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        icon="trash"
        type="danger"
      />

      {/* Share Modal */}
      {sharePostId && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSharePostId(null);
          }}
          postId={sharePostId}
        />
      )}
    </>
  );
}
