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

interface Post {
  id: string;
  title: string;
  description: string;
  userId: string;
}

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
        ...(doc.data() as Omit<Post, "id">),
      }));
      setPosts(postsData);
      setIsLoading(false);
    };

    fetchPosts();
  }, [search]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDelete = async (postId: string) => {
    const postToDelete = posts.find((post) => post.id === postId);
    if (postToDelete && user && user.uid === postToDelete.userId) {
      if (confirm("Are you sure you want to delete this post?")) {
        try {
          await deleteDoc(doc(db, "posts", postId));
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
          router.refresh();
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      }
    } else {
      console.error("You are not authorized to delete this post.");
    }
  };

  const handleEdit = (postId: string) => {
    router.push(`/edit-post/${postId}`);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <header className="header">
        <div className="container">
          <a href="/" className="logo">
            BLOGGIN'
          </a>
          <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
            {user ? (
              <>
                <a href="/posts">All Posts</a>
                <a href="/create-post">Create Post</a>
                <a href="/my-posts">My Posts</a>
                <button onClick={handleLogout} className="button">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <a href="/login">Log in</a>
                <a href="/signup" className="button">
                  Sign up
                </a>
              </>
            )}
            <button onClick={toggleDarkMode} className="theme-toggle">
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </nav>
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>
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
                      <button className="dropbtn">⋮</button>
                      <div className="dropdown-content">
                        <a onClick={() => handleEdit(post.id)}>Edit</a>
                        <a onClick={() => handleDelete(post.id)}>Delete</a>
                      </div>
                    </div>
                  </div>
                )}
                <div className="post-content">
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                  <a href={`/post/${post.id}`}>Read More</a>
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
    </div>
  );
}
