
"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import { useRouter, useParams } from "next/navigation"
import BackButton from "../../../components/BackButton"
import useAuth from "../../../hooks/useAuth"

export default function EditPostPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { id } = useParams()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const docRef = doc(db, "posts", id as string)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const post = docSnap.data()
          if (user && user.uid === post.userId) {
            setTitle(post.title)
            setDescription(post.description)
          } else if (user) {
            setError("You are not authorized to edit this post.")
          }
        }
      }
    }

    if (user) {
      fetchPost()
    }
  }, [id, user])

  if (loading) return <p>Loading...</p>
  if (!user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (id && user) {
        const docRef = doc(db, "posts", id as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          await updateDoc(docRef, {
            title,
            description,
          })
          router.push("/my-posts")
        } else {
          setError("You are not authorized to edit this post.")
        }
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <main className="container mx-auto px-4 max-w-3xl py-8">
      <BackButton />
      <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Post</h1>
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
          <button type="submit" className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-2">Update Post</button>
        </form>
      </div>
    </main>
  )
}
