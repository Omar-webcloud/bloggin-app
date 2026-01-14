"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, PlusSquare, User, LogOut, LogIn, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import { signOut } from "firebase/auth"
import { auth } from "../lib/firebase"
import ConfirmationModal from "./ConfirmationModal"

export default function Navbar() {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    await signOut(auth)
    setShowLogoutModal(false)
    router.push("/login")
  }

  if (loading) return null

  const isActive = (path: string) => pathname === path ? "active" : ""

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          BLOGGIN'
        </Link>
        
        <div className="navbar-links">
          <Link href="/" className={`nav-icon ${isActive("/")}`} title="Home">
            <Home />
          </Link>

          {user ? (
            <>
              {/* All Posts link removed as requested */}
              <Link href="/create-post" className={`nav-icon ${isActive("/create-post")}`} title="Create Post">
                <PlusSquare />
              </Link>
              <Link href="/my-posts" className={`nav-icon ${isActive("/my-posts")}`} title="My Posts">
                <User />
              </Link>
              <button onClick={handleLogout} className="nav-icon logout-btn" title="Log Out">
                <LogOut />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`nav-icon ${isActive("/login")}`} title="Log In">
                <LogIn />
              </Link>
              <Link href="/signup" className="button button-sm signup-btn">
                Sign Up
              </Link>
            </>
          )}

          <button onClick={toggleDarkMode} className="nav-icon theme-btn">
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Log Out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log Out"
        icon="logout"
        type="danger"
      />
    </nav>
  )
}
