
"use client"

import { useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import { auth, db } from "../lib/firebase"
import { signOut } from "firebase/auth"
import { collection, getDocs, query, where } from "firebase/firestore"

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      let q = query(collection(db, "posts"))
      if (search) {
        q = query(collection(db, "posts"), where("title", ">=", search), where("title", "<=", search + "\uf8ff"))
      }
      const querySnapshot = await getDocs(q)
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPosts(postsData)
    }

    fetchPosts()
  }, [search])

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

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
                <a href="/my-posts">My Posts</a>
                <a href="/create-post">Create Post</a>
                <button onClick={handleLogout} className="button">Log Out</button>
              </>
            ) : (
              <>
                <a href="/login">Log in</a>
                <a href="/signup" className="button">Sign up</a>
              </>
            )}
            <button onClick={toggleDarkMode} className="theme-toggle">
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </nav>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>
      <main className="container">
        <div className="search-container">
          <input type="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <section className="post-grid">
          {posts.map((post) => (
            <div className="post-card" key={post.id}>
              <img src={post.image} alt={post.title} />
              <div className="post-content">
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <a href={`/post/${post.id}`}>Read More</a>
              </div>
            </div>
          ))}
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
  )
}
