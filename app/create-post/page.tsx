
"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { useRouter } from "next/navigation"
import BackButton from "../../components/BackButton"
import useAuth from "../../hooks/useAuth"

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) return <p>Loading...</p>

  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await addDoc(collection(db, "posts"), {
        title,
        description,
        userId: user.uid,
        username: user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
      })
      router.push("/")
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <main className="container mx-auto px-4 max-w-3xl py-8">
      <BackButton />
      <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Post</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={10}
            className="w-full p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none min-h-[200px] resize-y"
          />
          <button type="submit" className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-2">Create Post</button>
        </form>
      </div>
    </main>
  )
}
