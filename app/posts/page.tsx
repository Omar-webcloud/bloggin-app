
"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../lib/firebase"
import Link from "next/link"
import BackButton from "../../components/BackButton"

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"))
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPosts(postsData)
    }

    fetchPosts()
  }, [])

  return (
    <main className="container">
      <BackButton />
      <div className="posts-grid">
        {posts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
