
"use client"

import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db, auth } from "../../lib/firebase"
import { useRouter } from "next/navigation"
import BackButton from "../../components/BackButton"

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const user = auth.currentUser
      if (user) {
        await addDoc(collection(db, "posts"), {
          title,
          description,
          author: user.uid,
        })
        router.push("/")
      }
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
          />
          <button type="submit">Create Post</button>
        </form>
      </div>
    </main>
  )
}
