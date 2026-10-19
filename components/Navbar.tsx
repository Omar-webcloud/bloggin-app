"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Bookmark, Sun, Moon, ChevronDown, User, LogOut, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { useBookmarks } from "../hooks/useBookmarks";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import ConfirmationModal from "./ConfirmationModal";

export default function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { bookmarkCount } = useBookmarks();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    setProfileMenuOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    await signOut(auth);
    setShowLogoutModal(false);
    router.push("/login");
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Omar";
  const userInitials = displayName
    .split(/[\s_]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "MO";

  const isEditorPage = pathname === "/create-post" || pathname.startsWith("/edit-post");

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-card/90 border-b border-border z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo (Beta removed per request) */}
          <Link href="/" className="flex items-center gap-1.5 group focus:outline-none shrink-0">
            <div className="flex items-center">
              <span className="relative inline-flex items-center justify-center font-bold text-xl sm:text-2xl tracking-tight text-foreground">
                {/* Stylized B with leaf motif inside */}
                <span className="relative inline-flex items-center mr-1">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-foreground transition-transform duration-300 group-hover:scale-105"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 6H22C27.5 6 31 9 31 13.5C31 16.5 29.2 18.8 26.5 19.6C30.2 20.5 32.5 23.2 32.5 27C32.5 32 28.5 35 22.5 35H8V6Z"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 27C12 20.5 17.5 16 24.5 16C24.5 22.5 19.5 27 12 27Z"
                      fill="#368061"
                      className="dark:fill-[#8fd8b5]"
                    />
                    <path
                      d="M12 27C15.5 23.5 19 20.5 23 18"
                      stroke="#0b0c0e"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span>loggin</span>
                <span className="text-sage-600 dark:text-sage-300 font-serif italic ml-0.5">&apos;</span>
              </span>
            </div>
          </Link>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Write / New Story CTA (Desktop & Tablet only; Phone uses sticky bottom button) */}
            <Link
              href={user ? "/create-post" : "/login"}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 shadow-sm transition-all active:scale-95"
              title="Write a new story (Press 'N')"
            >
              <Plus className="w-4 h-4 stroke-[2.3]" />
              <span>Write Story</span>
            </Link>

            {/* Saved / Bookmarks Reading List */}
            <Link
              href="/?category=Saved"
              className="relative p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Reading List"
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-sage-600 dark:bg-sage-300 text-white dark:text-slate-950 text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </Link>

            {/* User Auth Profile / Login */}
            {!loading && user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1.5 rounded-xl border border-transparent hover:border-border hover:bg-muted text-foreground transition-all"
                  title="Author Profile"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-sage-600 to-sky-500 flex items-center justify-center text-white font-semibold text-xs shadow-inner shrink-0">
                    {userInitials}
                  </div>
                  <span className="hidden md:inline text-xs font-medium max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="hidden sm:block w-3 h-3 text-muted-foreground" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-64 rounded-2xl bg-card border border-border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-border">
                      <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                      <p className="text-[11px] font-mono text-sky-600 dark:text-sky-400 truncate">
                        @{displayName.replace(/\s+/g, "_")}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/my-posts"
                        onClick={() => setProfileMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-xs sm:text-sm text-foreground hover:bg-muted flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          My Published Stories
                        </span>
                      </Link>
                      <Link
                        href="/?category=Saved"
                        onClick={() => setProfileMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-xs sm:text-sm text-foreground hover:bg-muted flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          Reading List
                        </span>
                        <span className="text-xs font-mono text-sage-600 dark:text-sage-300">
                          {bookmarkCount}
                        </span>
                      </Link>
                    </div>
                    <div className="pt-1 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-xs sm:text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !loading ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* On phone: Keep ONLY Login button */}
                <Link
                  href="/login"
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Log In
                </Link>
                {/* On desktop/tablet only: Show Sign Up button */}
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-0.5"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              )}
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
      </header>

      {/* Sticky Bottom Floating "+" Button for Mobile (like Instagram) */}
      {!isEditorPage && (
        <Link
          href={user ? "/create-post" : "/login"}
          className="sm:hidden fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 shadow-[0_8px_30px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_rgba(143,216,181,0.25)] flex items-center justify-center active:scale-90 transition-all duration-200 group border border-white/20 dark:border-slate-900/20"
          aria-label="Write a story"
          title="Write a story"
        >
          <Plus className="w-7 h-7 stroke-[2.4] transition-transform duration-200 group-hover:rotate-90" />
        </Link>
      )}
    </>
  );
}
