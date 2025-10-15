
"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import { useParams } from "next/navigation"
import BackButton from "../../../components/BackButton"

export default function PostPage() {
  const [post, setPost] = useState<any>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const docRef = doc(db, "posts", id as string)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() })
        } else {
          console.log("No such document!")
        }
      }
    }

    fetchPost()
  }, [id])

  if (!post) {
    return <div>Loading...</div>
  }

  return (
    <main className="container">
      <BackButton />
      <div className="post-container">
        <h1>{post.title}</h1>
        <p>{post.description}</p>
      </div>
    </main>
  )
}
