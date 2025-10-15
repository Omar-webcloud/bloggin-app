
"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import { useRouter, useParams } from "next/navigation"
import BackButton from "../../../components/BackButton"

export default function EditPostPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const docRef = doc(db, "posts", id as string)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const post = docSnap.data()
          setTitle(post.title)
          setDescription(post.description)
        } else {
          console.log("No such document!")
        }
      }
    }

    fetchPost()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (id) {
        const docRef = doc(db, "posts", id as string)
        await updateDoc(docRef, {
          title,
          description,
        })
        router.push("/my-posts")
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <main className="container">
      <BackButton />
      <div className="edit-post-container">
        <h1>Edit Post</h1>
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
          />
          <button type="submit">Update Post</button>
        </form>
      </div>
    </main>
  )
}
