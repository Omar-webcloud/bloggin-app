"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Signup from "@/components/Signup"
import Login from "@/components/Login"
import Logout from "@/components/Logout"
import CreateBlog from "@/components/CreateBlog"
import BlogList from "@/components/BlogList"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState("login")
  const [showCreateBlog, setShowCreateBlog] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-serif text-foreground">Bloggin'</h1>
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <Button
                    onClick={() => setShowCreateBlog(!showCreateBlog)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <PenSquare className="w-4 h-4 mr-2" />
                    {showCreateBlog ? "View Posts" : "New Post"}
                  </Button>
                  <Logout />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {!user ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-5xl font-serif text-balance leading-tight">Share your thoughts with the world</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                A minimal, elegant platform for writers and readers
              </p>
            </div>

            {showAuth === "login" ? (
              <div className="space-y-4">
                <Login onSuccess={() => setShowAuth("login")} />
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button onClick={() => setShowAuth("signup")} className="text-primary hover:underline font-medium">
                    Sign up
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Signup onSuccess={() => setShowAuth("login")} />
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button onClick={() => setShowAuth("login")} className="text-primary hover:underline font-medium">
                    Sign in
                  </button>
                </p>
              </div>
            )}

            <div className="mt-16">
              <h3 className="text-2xl font-serif text-center mb-8">Recent Posts</h3>
              <BlogList />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {showCreateBlog ? (
              <CreateBlog user={user} />
            ) : (
              <>
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-serif">All Posts</h2>
                  <p className="text-muted-foreground">Signed in as {user.email}</p>
                </div>
                <BlogList />
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Bloggin' — A modern minimal blog platform</p>
        </div>
      </footer>
    </div>
  )
}
