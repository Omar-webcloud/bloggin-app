
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
    <main className="container">
      <BackButton />
      <div className="create-post-container">
        <h1>Create Post</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={10}
            style={{ minHeight: "200px", resize: "vertical" }}
          />
          <button type="submit">Create Post</button>
        </form>
      </div>
    </main>
  )
}
