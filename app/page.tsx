"use client";

import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Component() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState<string | null>(null);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuPostId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    // ... existing fetchPosts logic ...
    const fetchPosts = async () => {
      setIsLoading(true);
      let q = query(collection(db, "posts"));
      if (search) {
        q = query(
          collection(db, "posts"),
          where("title", ">=", search),
          where("title", "<=", search + "\uf8ff")
        );
      }
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setIsLoading(false);
    };

    fetchPosts();
  }, [search]);

  const handleDelete = (postId: string) => {
      setPostToDeleteId(postId);
      setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!postToDeleteId) return;

    try {
        await deleteDoc(doc(db, "posts", postToDeleteId));
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postToDeleteId));
        router.refresh();
        setShowDeleteModal(false);
        setPostToDeleteId(null);
    } catch (error) {
        console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (postId: string) => {
    router.push(`/edit-post/${postId}`);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div className="">
      <main className="container">
        <div className="search-container">
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <section className="post-grid">
          {isLoading ? (
            <div className="loader-container">
              <div className="spinner"></div>
            </div>
          ) : (
            posts.map((post) => (
              <div className="post-card" key={post.id}>
                {user && user.uid === post.userId && (
                  <div className="post-card-menu">
                    <div className="dropdown">
                      <button 
                        className="dropbtn" 
                        onClick={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation(); // Prevent document listener from firing
                            setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id);
                        }}
                      >
                        ⋮
                      </button>
                      {activeMenuPostId === post.id && (
                          <div className="dropdown-content" style={{ display: 'block', position: 'absolute', right: 0, zIndex: 10 }}>
                            <div 
                                onClick={(e) => { e.stopPropagation(); handleEdit(post.id); }}
                                style={{ padding: '12px 16px', cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit' }}
                            >
                                Edit
                            </div>
                            <div 
                                onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                                style={{ padding: '12px 16px', cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit' }}
                            >
                                Delete
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Images removed as requested */}
                <div className="post-content">
                  <h2>{post.title}</h2>
                  <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.5rem" }}>
                    <span>By {post.username || "Unknown"}</span>
                    {" • "}
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <p>{post.description}</p>
                  
                  <div className="post-card-footer">
                    <a href={`/post/${post.id}`}>Full Blog</a>
                    <button 
                        onClick={() => handleShare(post.id)} 
                        className="share-btn"
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            fontSize: '0.9rem'
                        }}
                    >
                        Share <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; BLOGGIN App by Omar. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Help</a>
            <a href="#">Terms and Conditions</a>
          </div>
        </div>
      </footer>
      
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
    </div>
  );
}
