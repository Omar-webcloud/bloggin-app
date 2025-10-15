
"use client"
import { useState } from "react"
import { db } from "../../lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await addDoc(collection(db, "posts"), {
        title,
        description,
        image,
      })
      router.push("/")
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <main className="container">
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
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <button type="submit">Create Post</button>
        </form>
      </div>
    </main>
  )
}
