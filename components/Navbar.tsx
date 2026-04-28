"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { PlusSquare, User, LogOut, LogIn, Sun, Moon } from "lucide-react"
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

  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="/" className="navbar-logo flex items-center">
            <Image src="/logo-light.png" alt="Bloggin Logo" width={150} height={40} className="w-auto h-8 dark:hidden" priority />
            <Image src="/logo.png" alt="Bloggin Logo" width={150} height={40} className="w-auto h-8 hidden dark:block" priority />
          </Link>
        </div>
      </nav>
    )
  }

  const isActive = (path: string) => pathname === path ? "bg-black/5 dark:bg-white/10 text-primary" : "text-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-primary hover:-translate-y-0.5"

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#e4e1f5]/85 dark:bg-[#121212]/85 backdrop-blur-md border-b border-border z-50 transition-colors">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center no-underline">
          <Image src="/logo-light.png" alt="Bloggin Logo" width={150} height={40} className="w-auto h-8 dark:hidden" priority />
          <Image src="/logo.png" alt="Bloggin Logo" width={150} height={40} className="w-auto h-8 hidden dark:block" priority />
        </Link>
        
        <div className="flex items-center gap-4">


          {user ? (
            <>

              <Link href="/create-post" className={`p-2 rounded-lg transition-all flex items-center justify-center ${isActive("/create-post")}`} title="Create Post">
                <PlusSquare className="w-6 h-6" />
              </Link>
              <Link href="/my-posts" className={`p-2 rounded-lg transition-all flex items-center justify-center ${isActive("/my-posts")}`} title="My Posts">
                <User className="w-6 h-6" />
              </Link>
              <button 
                onClick={handleLogout} 
                className="p-2 rounded-lg transition-all flex items-center justify-center text-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-primary hover:-translate-y-0.5" 
                title="Log Out"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-block border border-transparent hover:bg-black/5 dark:hover:bg-white/10 text-primary px-2 py-1 text-center text-sm lg:px-4 lg:py-2 lg:text-base rounded-lg transition-colors font-medium" title="Log In">
                Log In
              </Link>
              <Link href="/signup" className="inline-block bg-primary text-primary-foreground px-2 py-1 text-center text-xs lg:px-4 lg:py-2 lg:text-sm rounded-lg transition-colors font-medium hover:bg-primary/90 ml-2">
                Sign Up
              </Link>
            </>
          )}

          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-lg transition-all flex items-center justify-center text-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-primary hover:-translate-y-0.5 ml-0"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
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
